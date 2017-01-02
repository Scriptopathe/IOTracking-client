export class DateHelper {
    static getMonths() : number[] {
        return [0,1,2,3,4,5,6,7,8,9,10,11]
    }

    static getMonthString(month : number) : string {
        return ["Janvier", "Février", "Mars",
            "Avril", "Mai", "Juin",
            "Juillet", "Août", "Septembre",
            "Octobre", "Novembre", "Décembre"][month]
    }

    static formatDate(date : Date) {
        return date.getDate() + " " + this.getMonthString(date.getMonth()) + " " + date.getFullYear()
    }

    static formatFullDate(date : Date) {
        date = new Date(date)
        return this.formatDate(date) + " à " + date.getHours() + "h" + date.getMinutes()
    }
}