<script lang="ts">
  import lottie from 'lottie-web';
  import { createEventDispatcher, onDestroy, onMount } from 'svelte';
  import Controls from './Controls.svelte';
  import {
    parseSrc,
    PlayerEvents,
    PlayerRender,
    PlayerState,
    PlayMode,
    triggerDownload,
  } from './utils';
  const dispatch = createEventDispatcher();
  let _counter = 0;
  let intermission = 0;

  // Autoplay animation on load
  export let autoplay = false;

  // Background color
  export let background: string;

  // Show controls
  export let controls: boolean;

  // Controls layout
  export let controlsLayout;

  // Number of times to loop animation.
  export let count = undefined;

  // Default frame to show if autoplay is disabled
  export let defaultFrame = 0;

  // Direction of animation
  export let direction = 1;

  // Player height
  export let height: number = undefined;

  // Whether to play on mouse hover
  export let hover = false;

  // Whether to loop animation
  export let loop = false;

  // Play mode
  export let mode = PlayMode.Normal;

  // Callback for when zoom is triggered
  export let onToggleZoom = undefined;

  // Renderer to use in lottie-web
  export let renderer = PlayerRender.SVG;

  // Playback speed.
  export let speed = 1;

  // Lottie file as either a URL or JSON content.
  export let src = '';

  // Styling for the Player's wrapper element
  export let style = '';

  // Player width
  export let width = undefined;
  export let divClass = undefined;

  let animationData;
  let animationRef;
  let playerRef;
  let wrapperRef;
  let instance;
  let frame = 0;
  let progress = 0;
  let io;
  let currentState = PlayerState.Loading;
  let isZoomed = false;
  let playerHeight;
  let playerWidth;
  let totalFrames;

  /**
   * Handle visibility change events.
   */
  const onVisibilityChange = () => {
    if (document.hidden === true && currentState === PlayerState.Playing) {
      freeze();
    } else if (currentState === PlayerState.Frozen) {
      play();
    }
  };

  /**
   * Initialize everything on component mount.
   */
  onMount(() => {
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          if (currentState === PlayerState.Frozen) {
            play();
          }
        } else if (currentState === PlayerState.Playing) {
          freeze();
        }
      });

      io.observe(animationRef);
    }

    // Add listener for Visibility API's change event.
    if (typeof document.hidden !== 'undefined') {
      document.addEventListener('visibilitychange', onVisibilityChange);
    }

    // Setup lottie player
    if (src) {
      load(src);
    }
  });

  /**
   * Cleanup on component destroy.
   */
  onDestroy(() => {
    // Remove intersection observer for detecting component being out-of-view.
    if (io) {
      io.disconnect();
      io = undefined;
    }

    // Remove the attached Visibility API's change event listener.
    document.removeEventListener('visibilitychange', onVisibilityChange);
  });

  /**
   * Configure and initialize lottie-web player instance.
   */
  export const load = (srcValue) => {
    if (!animationRef) {
      return;
    }

    // Clear previous animation, if any
    if (instance) {
      instance.destroy();
    }

    const options = {
      container: animationRef,
      loop,
      autoplay,
      renderer,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid meet',
        clearCanvas: true,
        progressiveLoad: true,
        hideOnTransparent: true,
      },
    };

    // Load the resource information
    try {
      const srcParsed = parseSrc(srcValue);
      const srcAttrib = typeof srcParsed === 'string' ? 'path' : 'animationData';

      // Initialize lottie player and load animation
      instance = lottie.loadAnimation({
        ...options,
        [srcAttrib]: srcParsed,
      } as any);
    } catch (err) {
      currentState = PlayerState.Error;
      dispatch(PlayerEvents.Error);
    }

    if (instance) {
      // Calculate and save the current progress of the animation
      instance.addEventListener('enterFrame', () => {
        frame = instance.currentFrame;
        if (instance.totalFrames !== totalFrames) {
          totalFrames = instance.totalFrames;
        }
        if (totalFrames !== 0) {
          progress = (instance.currentFrame / instance.totalFrames) * 100;
        } else {
          progress = 0;
        }

        dispatch(PlayerEvents.Frame, {
          frame: instance.currentFrame,
          progress: progress,
        });
      });

      instance.addEventListener('complete', () => {
        if (currentState !== PlayerState.Playing) {
          dispatch(PlayerEvents.Complete);
          return;
        }

        if (!loop || (count && _counter >= count)) {
          dispatch(PlayerEvents.Complete);
          return;
        }

        if (mode === PlayMode.Bounce) {
          if (count) {
            _counter += 0.5;
          }

          setTimeout(() => {
            dispatch(PlayerEvents.Loop);

            if (currentState === PlayerState.Playing) {
              instance.setDirection(instance.playDirection * -1);
              instance.play();
            }
          }, intermission);
        } else {
          if (count) {
            _counter += 1;
          }

          window.setTimeout(() => {
            dispatch(PlayerEvents.Loop);

            if (currentState === PlayerState.Playing) {
              instance.stop();
              instance.play();
            }
          }, intermission);
        }
      });

      // Handle animation data load complete
      instance.addEventListener('ready', () => {
        animationData = instance.animationData;
        totalFrames = instance.totalFrames;
        resize();
      });

      // Set error state when animation load fail event triggers
      instance.addEventListener('error', () => {
        currentState = PlayerState.Error;

        dispatch(PlayerEvents.Error);
      });

      // Set handlers to auto play animation on hover if enabled
      animationRef.addEventListener('mouseenter', () => {
        if (hover && currentState !== PlayerState.Playing) {
          play();
        }
      });
      animationRef.addEventListener('mouseleave', () => {
        if (hover && currentState === PlayerState.Playing) {
          stop();
        }
      });

      // Set initial playback speed and direction
      setSpeed(speed);
      setDirection(direction);

      // Start playing if autoplay is enabled
      if (autoplay) {
        play();
      } else if (!isNaN(defaultFrame)) {
        instance.goToAndStop(defaultFrame, true);
      }
    }
  };

  /**
   * Returns the lottie-web instance used in the component.
   */
  export const getLottie = () => {
    return instance;
  };

  /**
   * Start playing animation.
   */
  export const play = () => {
    if (!instance) {
      return;
    }

    currentState = PlayerState.Playing;
    instance.play();
    dispatch(PlayerEvents.Play);
  };

  /**
   * Pause animation play.
   */
  export const pause = () => {
    if (!instance) {
      return;
    }

    currentState = PlayerState.Paused;
    instance.pause();

    dispatch(PlayerEvents.Pause);
  };

  /**
   * Stops animation play.
   */
  export const stop = () => {
    if (!instance) {
      return;
    }

    currentState = PlayerState.Stopped;
    instance.stop();

    dispatch(PlayerEvents.Stop);
  };

  /**
   * Freeze animation play.
   * This internal state pauses animation and is used to differentiate between
   * user requested pauses and component instigated pauses.
   */
  export const freeze = () => {
    if (!instance) {
      return;
    }

    instance.pause();
    currentState = PlayerState.Frozen;

    dispatch(PlayerEvents.Freeze);
  };

  /**
   * Resize animation.
   */
  export const resize = () => {
    if (!instance) {
      return;
    }
    instance.resize();
  };

  /**
   * Seek to a given frame.
   */
  export const seek = (value) => {
    if (!instance) {
      return;
    }

    // Extract frame number from either number or percentage value
    const matches = value.toString().match(/^([0-9\\.]+)(%?)$/);
    if (!matches) {
      return;
    }

    // Calculate and set the frame number
    const resolvedFrame =
      matches[2] === '%' ? (instance.totalFrames * Number(matches[1])) / 100 : Number(matches[1]);

    dispatch(PlayerEvents.Seek, { frame: resolvedFrame, totalFrames: totalFrames });
    // Send lottie player to the new frame
    if (currentState === PlayerState.Playing) {
      instance.goToAndPlay(resolvedFrame, true);
    } else {
      instance.goToAndStop(resolvedFrame, true);
      instance.pause();
    }
  };

  /**
   * Snapshot the current frame as SVG.
   *
   * If 'download' argument is boolean true, then a download is triggered in browser.
   */
  export const snapshot = (download = true) => {
    let data;

    if (renderer === PlayerRender.SVG) {
      // Get SVG element and serialize markup
      const svgElement = animationRef.querySelector('svg');
      const serializedSvg = new XMLSerializer().serializeToString(svgElement);
      data = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(serializedSvg);

      // Trigger file download if needed
      if (download) {
        triggerDownload(data, `snapshot_${progress}.svg`);
      }
    } else if (renderer === PlayerRender.Canvas) {
      const canvas = animationRef.querySelector('canvas');
      data = canvas.toDataURL('image/png');

      // Trigger file download if needed
      if (download) {
        triggerDownload(data, `snapshot_${progress}.png`);
      }
    }

    return data;
  };

  /**
   * Sets the looping of the animation.
   *
   * @param value Whether to enable looping. Boolean true enables looping.
   */
  export const setLooping = (value) => {
    if (instance) {
      loop = value;
    }
  };

  /**
   * Sets animation play speed.
   *
   * @param value Playback speed.
   */
  export const setSpeed = (value) => {
    if (instance) {
      speed = value;
    }
  };

  /**
   * Animation play direction.
   *
   * @param value Direction values.
   */
  export const setDirection = (value) => {
    if (instance) {
      direction = value;
    }
  };

  /**
   * Toggle playing state.
   */
  export const togglePlay = () => {
    return currentState === PlayerState.Playing ? pause() : play();
  };

  /**
   * Toggles animation looping.
   */
  export const toggleLooping = () => {
    setLooping(!loop);
  };

  /**
   * Sets background color.
   */
  export const setBackground = (value: string) => {
    background = value;
  };

  export const toggleZoom = () => {
    // Check if custom handler for zoom toggle is set
    if (typeof onToggleZoom === 'function') {
      // Call the custom zoom toggle handler with current zoom status
      // Set return value as the zoom status
      isZoomed = Boolean(onToggleZoom(isZoomed));

      return;
    }

    if (!isZoomed) {
      wrapperRef.style.height = playerHeight + 'px';
      wrapperRef.style.width = playerWidth + 'px';

      document.body.appendChild(playerRef);
    } else {
      wrapperRef.appendChild(playerRef);

      wrapperRef.style.height = undefined;
      wrapperRef.style.width = undefined;
    }

    isZoomed = !isZoomed;

    setTimeout(() => resize(), 100);
  };

  // Try load new animation when the src value changes
  $: load(src);

  // Update the player with loop prop changes
  $: {
    if (instance) {
      instance.loop = loop;
    }
  }

  // Update the player with speed prop changes
  $: {
    if (instance) {
      instance.setSpeed(speed);
    }
  }

  // Update the player with direction prop changes
  $: {
    if (instance) {
      instance.setDirection(direction);
    }
  }
</script>

<div
  bind:this={wrapperRef}
  class={divClass}
  style="{width ? `width:${width}px;` : ''}{height ? `height:${height}px;` : ''}{style}"
  bind:clientHeight={playerHeight}
  bind:clientWidth={playerWidth}
>
  <div
    bind:this={playerRef}
    class="lottie-player"
    class:with-controls={controls}
    class:is-zoomed={isZoomed}
  >
    <div class:animation={true} bind:this={animationRef} style="background: {background}">
      {#if currentState === PlayerState.Error}
        <div class="lottie-player-error">⚠️</div>
      {/if}
    </div>
    {#if controls}
      <Controls
        on:background={(e) => setBackground(e.detail.color)}
        layout={controlsLayout}
        {animationData}
        {background}
        {currentState}
        {frame}
        {instance}
        {loop}
        {progress}
        {seek}
        {snapshot}
        {stop}
        {toggleZoom}
        {toggleLooping}
        {togglePlay}
        {totalFrames}
      />
    {/if}
  </div>
</div>

<style>
  .lottie-player {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    transition: box-shadow 0.6s;
    flex: 1 0 auto;
  }

  .lottie-player.is-zoomed {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    box-shadow: 0px 0px 56px -14px rgba(0, 0, 0, 0.6);
    margin: 100px;
    border-radius: 6px;
  }

  .animation {
    overflow: hidden;
  }

  .lottie-player-error {
    display: flex;
    justify-content: center;
    height: 100%;
    align-items: center;
  }
</style>
