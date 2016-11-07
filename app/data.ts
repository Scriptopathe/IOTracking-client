export class HWIdentifier {
    constructor(public id : String, public hardwareId : String) { }
}

export class TeamIdentifier {
    constructor(public id : String, public name : String) { }
}

export class RunnerIdentifier {
    constructor(public id : String, public nickname : String) { }
}

export class DeviceAssociation {
    constructor(public boxId : HWIdentifier, public runnerId : RunnerIdentifier, 
                public boatId : String) { }
}

export class Run {
    constructor(public runners : DeviceAssociation[]) { }
}

// HWIdentifier : création pour chaque boitier d'un HWIdentifier.
// TeamIdentifier : représente un identifiant de tema unique. Lifespan : 1 course.
// RunnerIdentifier : représente un coureur. Lifespan : éternel
// DeviceAssociation : Lifespan = 1 course
// Run : Lifespan = 1 course