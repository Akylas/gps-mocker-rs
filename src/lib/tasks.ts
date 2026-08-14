import { writable } from 'svelte/store';

export type TaskStepStatus = 'pending' | 'running' | 'done' | 'error';

export interface TaskStep {
    label: string;
    /** the underlying command or URL, shown on hover */
    command?: string;
    status: TaskStepStatus;
    detail?: string;
}

export interface Task {
    title: string;
    steps: TaskStep[];
    running: boolean;
    summary?: string;
    failed?: boolean;
}

export interface TaskLabels {
    succeeded: string;
    failed: (count: number, total: number) => string;
}

export const task = writable<Task | null>(null);

let dismissTimer: ReturnType<typeof setTimeout>;

export function startTask(title: string, steps: { label: string; command?: string }[]) {
    clearTimeout(dismissTimer);
    task.set({ title, running: true, steps: steps.map((step) => ({ ...step, status: 'pending' })) });
}

export function updateStep(index: number, status: TaskStepStatus, detail?: string) {
    task.update((current) => {
        if (!current) {
            return current;
        }
        const steps = current.steps.slice();
        steps[index] = { ...steps[index], status, detail: detail || undefined };
        return { ...current, steps };
    });
}

export function finishTask(labels: TaskLabels) {
    task.update((current) => {
        if (!current) {
            return current;
        }
        const failures = current.steps.filter((step) => step.status === 'error').length;
        const next: Task = {
            ...current,
            running: false,
            failed: failures > 0,
            summary: failures > 0 ? labels.failed(failures, current.steps.length) : labels.succeeded
        };
        if (!next.failed) {
            // keep failures on screen; they are the ones worth reading
            dismissTimer = setTimeout(() => task.set(null), 4000);
        }
        return next;
    });
}

export function dismissTask() {
    clearTimeout(dismissTimer);
    task.set(null);
}

/** One-shot progress report for an operation that is not a list of steps. */
export async function runSingleTask<T>(title: string, label: string, labels: TaskLabels, work: () => Promise<T>): Promise<T | undefined> {
    startTask(title, [{ label }]);
    updateStep(0, 'running');
    try {
        const result = await work();
        updateStep(0, 'done');
        finishTask(labels);
        return result;
    } catch (error) {
        updateStep(0, 'error', (error as Error)?.message || String(error));
        finishTask(labels);
        return undefined;
    }
}

export function errorMessage(error: unknown) {
    return (error as Error)?.message || String(error);
}
