export interface Point 
{ 
    x : number
    y : number
}

export interface TimePoint 
{ 
    x : number
    y : number
    t : number
} 
/** 
 * Represents a reference to another object of the database.
 */
export class Reference<T> extends String { }

export class DBItem {
    public constructor(public _id? : string) { }
    public get identifier() {
        return this._id
    }

    public loadValues(values : any) {
        for(let key in this) {
            if(key == "identifier")
                continue
            this[key] = values[key]
        }
        return this
    }
}

export class Regata extends DBItem {
    public constructor(public name? : string,
        public startDate? : Date,
        public endDate? : Date,
        public location? : string,
        public races? : Array<Race>) { 
            super(null)
        }
}

/**
 * Interface containing all the fields of a racer object.
 */
export class Racer {
    public constructor(
        public boatIdentifier : string,
        public user : Reference<User>,
        public device : Reference<Device>
    ) { }
}

/**
 * Interface containing all the fields of a race object.
 */
export class RaceMap extends DBItem {
    public constructor(
        public raceMapImageUrl : string,
        public northLatReference : number,
        public southLatReference : number,
        public eastLongReference : number,
        public westLongReference : number
    ) {
        super(null)
    }
}

/**
 * Interface containing all the fields of a user object.
 */
export class User extends DBItem {
    public constructor(
        public username : string,
        public password : string,
        public role : string
    ) {
        super(null)
    }
} 

/**
 * Interface containing all the fields of a race object.
 */
export class Race {
    public constructor(
        public startDate : Date,
        public endDate : Date,
        public concurrents : Array<Racer>,
        public map : Reference<RaceMap>,
        public data : Reference<RaceData>,
        public buoys : Array<Point>,
        public name : string
    ) { }
}

/**
 * Interface containing all the fields of a device object.
 */
export class Device extends DBItem {
    public constructor(
        public hwid : string,
        public name : string
    ) {
        super(null)
    }
}

/**
 * Interface containing all the fields of a raceData object.
 */
export class RaceData extends DBItem {
    public constructor(
        public rawData : { [devId : string] : Array<TimePoint> }
    ) {
        super(null)
    }
}

export class Server {
    public static BaseUrl = "http://localhost:3001/api"
    public static RegattasUrl = Server.BaseUrl + "/regattas"
}