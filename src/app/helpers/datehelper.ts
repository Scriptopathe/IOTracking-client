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

    static getDays() {
        return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 
                16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
    }

    static getHours() {
        return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 
                16, 17, 18, 19, 20, 21, 22, 23]
    }

    static getMinutes() {
        return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 
                16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
                31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,
                52,53,54,55,56,57,58,59]
    }

    static getYears(lastYear : number) {
        var years : number[] = []
        for(let i = 2000; i <= lastYear; i++) {
            years.push(i)
        }
        return years
    }
    static formatDate(date : Date) {
        return date.getDate() + " " + this.getMonthString(date.getMonth()) + " " + date.getFullYear()
    }

    static formatFullDate(date : Date) {
        date = new Date(date)
        return this.formatDate(date) + " à " + date.getHours() + "h" + date.getMinutes()
    }
}