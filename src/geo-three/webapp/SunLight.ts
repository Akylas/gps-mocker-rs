/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import {DirectionalLight, Quaternion, Vector2, Vector3} from 'three';
export class SunLight extends DirectionalLight
{
	// Latitude and longtitude of the current location on the world
	// Measured as decimal degrees. North and east is positive
	coordinates;

	savedPosition: Vector3;

	// The unit vector that is pointing the north in the scene
	north;

	// The unit vector that is pointing the east in the scene
	east;

	// The unit vector that is pointing the ground in the scene, same as gravity
	nadir;

	declare type;

	// The distance of the directional light from this object and it's target.
	// the given north vector is multiplied with this value and the resulting
	// vector is the displacement of the directional light from the target.
	sun_distance;

	// The azimuth of the sun. Starts from the north, clockwise. In radians.
	azimuth;

	// The elevation of the sun. Starts from the horizon. In radians.
	elevation;

	// Local date and time
	localDate: Date;

	constructor(coordinates_: Vector2, north_: Vector3, east_: Vector3, nadir_: Vector3, sun_distance_ = 1.0) 
	{
		super(0xffffff);
		// this.type = 'SunLight';

		this.savedPosition = new Vector3(0, 0, 0);
		this.coordinates = new Vector2();
		this.coordinates.copy( coordinates_ );

		this.north = north_;

		this.east = east_;

		this.nadir = nadir_;

		this.sun_distance = sun_distance_;

		this.azimuth = 0.0;
		this.elevation = 0.0;

		this.localDate = new Date();
		this.castShadow = true;

	}

	setWorldPosition(vector: Vector3) 
	{
		this.savedPosition.set(vector.x, vector.y, vector.z);
		this.updateDirectionalLight();
	}

	setPosition(lat, long) 
	{

		this.coordinates.set( lat, long );
		this.updateOrientation(false);
		this.updateDirectionalLight();
	}

	setDate(date) 
	{
		this.localDate = date;
		this.updateOrientation(false);
		this.updateDirectionalLight();
	}

	// Updates the orientation of the sun using the coordinates and the localDate
	updateOrientation(update_date_ = true) 
	{
		// Update the local date if the parameter is true (true by default).
		if ( update_date_ ) 
		{ 
			this.localDate = new Date();
		}

		const solarOrientationCalculator = new SolarOrientationCalculator();

		const sunOrientation = solarOrientationCalculator.getAzEl(
			this.coordinates.x,
			this.coordinates.y,
			this.localDate
		);
		this.azimuth = this._degreesToRadians( sunOrientation.azimuth );
		this.elevation = this._degreesToRadians( sunOrientation.elevation );
	}

	// Updates the directional light based on the sun's orientation and the north
	// vector. This is actually done by rotating the hinge object which is the
	// parent of the directional light.
	updateDirectionalLight() 
	{
		// If the elevation is less than zero, there is no sun light.
		// Starting from 2 degrees, start fading the light
		const FADE_OUT_THRESHOLD = -2.0;
		const elevationDegrees = 180.0 * this.elevation / Math.PI;
		if ( elevationDegrees < FADE_OUT_THRESHOLD ) 
		{
			this.intensity = 0.0;
			return;
		}
		else if ( elevationDegrees < 0 && elevationDegrees >= FADE_OUT_THRESHOLD) 
		{
			this.intensity = elevationDegrees / FADE_OUT_THRESHOLD;
		}
		else 
		{
			this.intensity = 2.0;
		}
		this.position.copy( this.north );
		this.position.multiplyScalar( this.sun_distance );
		const rotator = new Quaternion();
		const result = new Quaternion();
		rotator.setFromAxisAngle( this.east, this.elevation );
		result.premultiply( rotator );
		rotator.setFromAxisAngle( this.nadir, this.azimuth );
		result.premultiply( rotator );
		this.position.applyQuaternion(result);
		this.position.add(this.savedPosition);
		this.target.position.copy(this.savedPosition);
	}

	_degreesToRadians(degrees_) 
	{
		return degrees_ % 360.0 * Math.PI / 180.0;
	}
}
// ---
// Methods for calculating the Sun's orientation go below
// ---

class SolarOrientationCalculator 
{
	a: string;

	constructor() 
	{
		this.a = 'some val';
	}

	getAzEl(lat_, lon_, date_ = new Date()) 
	{
		const jday = this._getJD( date_ );
		const tl = this._getTimeLocal( date_ );
		const tz = date_.getTimezoneOffset() / -60;
		const total = jday + tl/1440.0 - tz/24.0;
		const T = this._calcTimeJulianCent( total );
		return this._calcAzEl( false, T, tl, lat_, lon_, tz );
	}

	_getJD(date_ = new Date()) 
	{
		let docmonth = date_.getMonth() + 1;
		let docday = date_.getDate();
		let docyear = date_.getFullYear();
		if ( this._isLeapYear(docyear) && docmonth === 2 ) 
		{
			if (docday > 29) 
			{
				docday = 29;
			} 
		}
		else 
		{
			// 1900 is a known non-leap year
			if (docday > new Date(1900, docmonth, 0).getDate()) 
			{
				docday = new Date(1900, docmonth, 0).getDate();
			}
		}
		if (docmonth <= 2) 
		{
			docyear -= 1;
			docmonth += 12;
		}
		const A = Math.floor(docyear/100);
		const B = 2 - A + Math.floor(A/4);
		const JD = Math.floor(365.25*(docyear + 4716)) + 
		Math.floor(30.6001*(docmonth+1)) + docday + B - 1524.5;
		return JD;
	}

	// Returns the current time in minutes without the DST
	_getTimeLocal(date_ = new Date()) 
	{
		let totalMinutes = 0.0;
		totalMinutes += 60.0 * date_.getHours();
		// TODO
		// Remove one hour if DST is in effect
		totalMinutes += date_.getMinutes();
		totalMinutes += date_.getSeconds() / 60.0;
		return totalMinutes;
	}

	_calcTimeJulianCent(jd) 
	{
		const T = (jd - 2451545.0)/36525.0;
		return T;
	}

	_calcAzEl(output, T, localtime, latitude, longitude, zone) 
	{
		const result = {'azimuth': 0.0, 'elevation': 0.0};
		const eqTime = this._calcEquationOfTime(T);
		const theta = this._calcSunDeclination(T);
		const solarTimeFix = eqTime + 4.0 * longitude - 60.0 * zone;
		const earthRadVec = this._calcSunRadVector(T);
		let trueSolarTime = localtime + solarTimeFix;
		while (trueSolarTime > 1440)
		{
			trueSolarTime -= 1440;
		}
		let hourAngle = trueSolarTime / 4.0 - 180.0;
		if (hourAngle < -180) 
		{
			hourAngle += 360.0;
		}
		const haRad = this._degToRad(hourAngle);
		let csz = Math.sin(this._degToRad(latitude)) *
		Math.sin(this._degToRad(theta)) + Math.cos(this._degToRad(latitude)) *
		Math.cos(this._degToRad(theta)) * Math.cos(haRad);
		if (csz > 1.0) 
		{
			csz = 1.0;
		}
		else if (csz < -1.0) 
		{ 
			csz = -1.0;
		}
		const zenith = this._radToDeg(Math.acos(csz));
		const azDenom = Math.cos(this._degToRad(latitude)) *
		Math.sin(this._degToRad(zenith));
		if (Math.abs(azDenom) > 0.001) 
		{
			let azRad = ( Math.sin(this._degToRad(latitude)) *
			Math.cos(this._degToRad(zenith)) -
			Math.sin(this._degToRad(theta))) / azDenom;
			if (Math.abs(azRad) > 1.0) 
			{
				if (azRad < 0) 
				{
					azRad = -1.0;
				}
				else 
				{
					azRad = 1.0;
				}
			}
			var azimuth = 180.0 - this._radToDeg(Math.acos(azRad));
			if (hourAngle > 0.0) 
			{
				azimuth = -azimuth;
			}
		}
		else 
		{
			if (latitude > 0.0) 
			{
				azimuth = 180.0;
			}
			else 
			{ 
				azimuth = 0.0;
			}
		}
		if (azimuth < 0.0) 
		{
			azimuth += 360.0;
		}
		const exoatmElevation = 90.0 - zenith;

		// Atmospheric Refraction correction

		if (exoatmElevation > 85.0) 
		{
			var refractionCorrection = 0.0;
		}
		else 
		{
			const te = Math.tan(this._degToRad(exoatmElevation));
			if (exoatmElevation > 5.0) 
			{
				var refractionCorrection = 58.1 / te - 0.07 / (te*te*te) +
				0.000086 / (te*te*te*te*te);
			}
			else if (exoatmElevation > -0.575) 
			{
				var refractionCorrection = 1735.0 + exoatmElevation *
				(-518.2 + exoatmElevation * (103.4 + exoatmElevation *
					(-12.79 + exoatmElevation * 0.711) ) );
			}
			else 
			{
				var refractionCorrection = -20.774 / te;
			}
			refractionCorrection = refractionCorrection / 3600.0;
		}

		const solarZen = zenith - refractionCorrection;

		result.azimuth = Math.floor(azimuth*100 +0.5)/100.0;
		result.elevation = Math.floor((90.0-solarZen)*100+0.5)/100.0;
		return result;
	}

	_isLeapYear(yr) 
	{
		return yr % 4 === 0 && yr % 100 !== 0 || yr % 400 === 0;
	}

	_radToDeg(angleRad) 
	{
		return 180.0 * angleRad / Math.PI;
	}

	_degToRad(angleDeg) 
	{
		return Math.PI * angleDeg / 180.0;
	}

	_calcEquationOfTime(t) 
	{
		const epsilon = this._calcObliquityCorrection(t);
		const l0 = this._calcGeomMeanLongSun(t);
		const e = this._calcEccentricityEarthOrbit(t);
		const m = this._calcGeomMeanAnomalySun(t);

		let y = Math.tan(this._degToRad(epsilon)/2.0);
		y *= y;

		const sin2l0 = Math.sin(2.0 * this._degToRad(l0));
		const sinm = Math.sin(this._degToRad(m));
		const cos2l0 = Math.cos(2.0 * this._degToRad(l0));
		const sin4l0 = Math.sin(4.0 * this._degToRad(l0));
		const sin2m = Math.sin(2.0 * this._degToRad(m));

		const Etime = y * sin2l0 - 2.0 * e * sinm + 4.0 * e * y * sinm * cos2l0 -
		0.5 * y * y * sin4l0 - 1.25 * e * e * sin2m;
		return this._radToDeg(Etime)*4.0; // in minutes of time
	}

	_calcSunDeclination(t) 
	{
		const e = this._calcObliquityCorrection(t);
		const lambda = this._calcSunApparentLong(t);

		const sint = Math.sin(this._degToRad(e)) * Math.sin(this._degToRad(lambda));
		const theta = this._radToDeg(Math.asin(sint));
		return theta; // in degree
	}

	_calcSunRadVector(t) 
	{
		const v = this._calcSunTrueAnomaly(t);
		const e = this._calcEccentricityEarthOrbit(t);
		const R = 1.000001018 * (1 - e * e) /
		(1 + e * Math.cos(this._degToRad(v)));
		return R; // in AU
	}

	_calcObliquityCorrection(t) 
	{
		const e0 = this._calcMeanObliquityOfEcliptic(t);
		const omega = 125.04 - 1934.136 * t;
		const e = e0 + 0.00256 * Math.cos(this._degToRad(omega));
		return e; // in degree
	}

	_calcSunApparentLong(t) 
	{
		const o = this._calcSunTrueLong(t);
		const omega = 125.04 - 1934.136 * t;
		const lambda = o - 0.00569 - 0.00478 * Math.sin(this._degToRad(omega));
		return lambda; // in degrees
	}

	_calcGeomMeanLongSun(t) 
	{
		let L0 = 280.46646 + t * (36000.76983 + t*0.0003032);
		while (L0 > 360.0)
		{
			L0 -= 360.0;
		}
		while (L0 < 0.0)
		{
			L0 += 360.0;
		}
		return L0; // in degrees
	}

	_calcEccentricityEarthOrbit(t) 
	{
		const e = 0.016708634 - t * (0.000042037 + 0.0000001267 * t);
		return e; // unitless
	}

	_calcGeomMeanAnomalySun(t) 
	{
		const M = 357.52911 + t * (35999.05029 - 0.0001537 * t);
		return M; // in degrees
	}

	_calcSunTrueAnomaly(t) 
	{
		const m = this._calcGeomMeanAnomalySun(t);
		const c = this._calcSunEqOfCenter(t);
		const v = m + c;
		return v; // in degrees
	}

	_calcMeanObliquityOfEcliptic(t) 
	{
		const seconds = 21.448 - t*(46.8150 + t*(0.00059 - t*0.001813));
		const e0 = 23.0 + (26.0 + seconds/60.0)/60.0;
		return e0; // in degrees
	}

	_calcSunTrueLong(t) 
	{
		const l0 = this._calcGeomMeanLongSun(t);
		const c = this._calcSunEqOfCenter(t);
		const O = l0 + c;
		return O; // in degrees
	}

	_calcSunEqOfCenter(t) 
	{
		const m = this._calcGeomMeanAnomalySun(t);
		const mrad = this._degToRad(m);
		const sinm = Math.sin(mrad);
		const sin2m = Math.sin(mrad+mrad);
		const sin3m = Math.sin(mrad+mrad+mrad);
		const C = sinm * (1.914602 - t * (0.004817 + 0.000014 * t)) + sin2m *
		(0.019993 - 0.000101 * t) + sin3m * 0.000289;
		return C; // in degrees
	}
}
