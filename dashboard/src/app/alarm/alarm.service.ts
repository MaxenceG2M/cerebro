
import {throwError as observableThrowError,  Observable ,  throwError as _throw } from 'rxjs';
/*
 * This file is part of the Cerebro distribution.
 * (https://github.com/voyages-sncf-technologies/cerebro)
 * Copyright (C) 2017 VSCT.
 *
 * Cerebro is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, version 3 of the License.
 *
 * Cerebro is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import { Injectable }                                               from '@angular/core';
import { Response } from '@angular/http'; // TODO Remove it
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { AppConfig } from '../app.config';

import { Alarm }            from './alarm';
import { AlarmDetail }      from './alarm-detail';
import { Subscription }     from '../subscription/subscription';
import { CerebroException } from '../common/error/cerebroException';
import { catchError } from 'rxjs/operators';

const headers = new HttpHeaders({
    'Content-Type': 'application/json'
})

const headerOptions = {
    headers: headers
};

@Injectable()
export class AlarmService {

    private remoteRootUrl = this.config.get("services_url");
    private alarmAddUrl = this.remoteRootUrl + "/alarms";
    private alarmSearchUrl = this.remoteRootUrl + "/alarms/search";
    private alarmUpdateUrl = this.remoteRootUrl + "/alarms";

    constructor(
      private http: HttpClient,
      private config: AppConfig
    ) { }

    getAlarms(): Observable<Alarm[]> {
        return this.http.get<Alarm[]>(this.remoteRootUrl + "/alarms")
            .pipe(
                catchError(this.handleError)
            );
    }

    getAlarmsBySubscriptionTarget(target: string) {
        let params = new URLSearchParams();
        params.set('subscriptionTarget', target);

        return this.http.get(this.remoteRootUrl + "/alarms?" + params)
            .pipe(
                catchError(this.handleError)
            );
    }

    getAlarm(id: string): Observable<AlarmDetail> {
        return this.http.get<AlarmDetail>(this.remoteRootUrl + "/alarms/" + id)
            .pipe(
                catchError(this.handleError)
            );
    }

    addAlarm(newAlarm: Alarm) {
        let body = JSON.stringify(newAlarm);

        return this.http.post(this.alarmAddUrl, body, { headers, responseType: 'text' as 'text'})
            .pipe(
                catchError(this.handleError)
            );
    }

   updateAlarm(alarm: Alarm) {
        let body = JSON.stringify(alarm);

        return this.http.put(this.alarmUpdateUrl, body, { headers, responseType: 'text' as 'text'})
            .pipe(
                catchError(this.handleError)
            );
    }

    addSubscription(subscription: Subscription, alarmId: string) {
      console.log('addSubscription');
      let body = JSON.stringify(subscription);

      return this.http.post(this.remoteRootUrl + "/alarms/" + alarmId + "/subscriptions", body, headerOptions)
        .pipe(
            catchError(this.handleError)
        );
    }

    deleteSubscription(alarm: Alarm, subscription: Subscription) {
        console.log('add delete');
        return this.http.delete(this.remoteRootUrl + "/alarms/" + alarm.id + "/subscriptions/" + subscription.id,
                { headers, responseType: 'text' as 'text'})
            .pipe(
                catchError(this.handleError)
            );
    }

    searchAlarm(alarm: Alarm): Observable<Alarm> {
        let body = JSON.stringify(alarm);

        return this.http.post<Alarm>(this.alarmSearchUrl, body, headerOptions)
            .pipe(
                catchError(this.handleError)
            );
    }

    searchSubscription(subscription: Subscription, alarmId: string) {
        let body = JSON.stringify(subscription);

        return this.http.post(this.remoteRootUrl + "/alarms/" + alarmId + "/subscriptions/search", body, headerOptions)
            .pipe(
                catchError(this.handleError)
            );
    }

    updateSubscription(subscription: Subscription, alarmId: string) {
      let body = JSON.stringify(subscription);

      return this.http.put(this.remoteRootUrl + "/alarms/" + alarmId + "/subscriptions/" + subscription.id, body, headerOptions)
          .pipe(
              catchError(this.handleError)
            );
    }

    private oldhandleError(errorResponse: any) {
        // in a real world app, we may send the server to some remote logging infrastructure
        // instead of just logging it to the console
        if (errorResponse instanceof Response) {
          return observableThrowError(errorResponse.json() as CerebroException || 'Server error');
        }

        return observableThrowError(errorResponse || 'Server error');
    }

    private handleError(error: HttpErrorResponse) {
        console.log("ERROR");
        console.log(error.error);
        if (error.error instanceof ErrorEvent) {
          // A client-side or network error occurred. Handle it accordingly.
          console.error('An error occurred:', error.error.message);
        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong,
          console.error(
            `Backend returned code ${error.status}, ` +
            `body was: ${error.error}`);
        }
        // return an observable with a user-facing error message
        return _throw(
          'Something bad happened; please try again later.');
      };
}
