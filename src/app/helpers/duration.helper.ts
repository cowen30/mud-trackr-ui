import { Injectable } from "@angular/core";
import { Duration } from "luxon";

@Injectable({
	providedIn: 'root'
})
export class DurationHelper {

	getDurationString(seconds: number): string {
		const duration = Duration.fromMillis(seconds * 1000);
		return duration.toFormat('hh:mm:ss');
	}

}
