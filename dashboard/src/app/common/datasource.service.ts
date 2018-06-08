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
import { Response } from '@angular/http'; // TODO remove it
import { HttpClient } from '@angular/common/http';

import {throwError as _throw,  Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AppConfig } from '../app.config';

import { CerebroException } from '../common/error/cerebroException';

@Injectable()
export class DatasourceService {

    private remoteRootUrl = this.config.get("services_url");
    private datasourceLocationsUrl = this.remoteRootUrl + "/datasources/locations";

    constructor(
      private http: HttpClient,
      private config: AppConfig
    ) { }

    getLocations(): Observable<string[]> {
        return this.http.get<string[]>(this.datasourceLocationsUrl)
            .pipe(
                catchError(this.handleError)
            );
    }

    private handleError(errorResponse: any) {
        // in a real world app, we may send the server to some remote logging infrastructure
        // instead of just logging it to the console
        if (errorResponse instanceof Response) {
          return _throw(errorResponse.json() as CerebroException || 'Server error');
        }

        return _throw(errorResponse || 'Server error');
    }
}
