import { Injectable }                   from '@angular/core';
import { Response }                     from '@angular/http';
import { HttpClient as Http }           from './http-client.service'
import { Observable, Subscriber }       from 'rxjs/Rx';
import { Inject }                       from '@angular/core';
import { RaceMap, Server }              from './server-model';

@Injectable()
export class RacemapsService {
    private progressObserver : Subscriber<number>
    public progress: Observable<number>
    public constructor(private http : Http) {
        this.progress = new Observable<number>((observer : Subscriber<number>) => {
            this.progressObserver = observer
        }).share()
    }

    public getImageUrl(racemap : RaceMap) : string {
        return Server.RaceMapImagesUrl + "/" + racemap.identifier
    }

    public uploadRacemap(file: File, filename : string): Observable<number> {
        return new Observable<number>((observer : Subscriber<number>) => {
            let formData: FormData = new FormData()
            let xhr: XMLHttpRequest = new XMLHttpRequest();

            formData.append("file", file, file.name);
            formData.append("filename", filename)
            
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        observer.next(xhr.response);
                        observer.complete();
                    } else {
                        observer.error(xhr.response);
                    }
                }
            };

            xhr.upload.onprogress = (event) => {
                if(this.progressObserver != null)
                    this.progressObserver.next(Math.round(event.loaded / event.total * 100))
            };

            xhr.open('POST', Server.RaceMapUploadUrl, true);
            xhr.send(formData);
        });
    }

    public deleteRacemap(racemap : RaceMap) : Observable<boolean> {
        var self = this
        
        return new Observable<boolean>((subscriber : Subscriber<boolean>) => {
            if(racemap.identifier == null) {
                // new racemap
                subscriber.next(true)
                subscriber.complete()
            } else {
                // update racemap
                self.http.delete(Server.RaceMapUrl + "/" + racemap.identifier)
                .subscribe((value) => {
                    if(!value.ok) subscriber.error(value.status)
                    subscriber.next(value.ok)
                    subscriber.complete()
                }, (error : Response) => {
                    subscriber.error(error.statusText)
                })
            }
        })
    }



    public saveRacemap(racemap : RaceMap) : Observable<boolean> {
        var self = this
        return new Observable<boolean>((subscriber : Subscriber<boolean>) => {
            if(racemap.identifier == null) {
                // new racemap
                self.http.post(Server.RaceMapUrl, JSON.stringify(racemap))
                .subscribe((value) => {
                    racemap.loadValues(value.json())
                    subscriber.next(value.ok)
                    subscriber.complete()
                }, (error : Response) => {
                    subscriber.error(error)
                })

            } else {
                // update racemap
                self.http.put(Server.RaceMapUrl + "/" + racemap.identifier, 
                              JSON.stringify(racemap)).subscribe((value) => {
                    subscriber.next(value.ok)
                    subscriber.complete()
                }, (error) => {
                    subscriber.error(error)
                })
            }
        })
    }

    public loadRacemaps() : Observable<RaceMap[]> {
        var self = this
        return new Observable<RaceMap[]>((subscriber : Subscriber<RaceMap[]>) => {
            self.http.get(Server.RaceMapUrl).subscribe((value) => {
                var maps : RaceMap[] = []
                var jsonMaps : any[] = value.json()
                for(let jsonMap of jsonMaps) {
                    var map = new RaceMap()
                    maps.push(map.loadValues(jsonMap))
                }
                subscriber.next(maps)
                subscriber.complete()
            }, (err) => {
                subscriber.error(err)
            })
        })
    }
}