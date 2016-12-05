import { Injectable }       from '@angular/core';
import { Http, Response }   from '@angular/http';
import { Observable }       from 'rxjs/Rx';
import { Inject }           from '@angular/core';


export class Lake {
    constructor (public bounds : number[], public name : string,
                 public background : string) {
        
    }

    public static loadLakes(http: Http) : Observable<Lake[]> {
        var lakes : Lake[]
        var json : any


        return http.get('app/static/places.json')
        .map((res : Response) => 
        {
            json = res.json()["places"]
            lakes = []
            for(let i = 0; i < json.length; i++)
            {
                let entry = json[i]
                lakes[i] = new Lake(entry["bounds"], entry["name"], entry["background"]) 
            }

            return lakes
        });
    }
}
@Injectable()
export class TestService {
    lakes : Lake[]

    loadLakes(@Inject(Http) http : Http) : void {
        Lake.loadLakes(http).subscribe(
            res => {
                this.lakes = res
            },
            err => {
                console.log("Error : " + String(err))
            }
        )
    }
    
}