import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './components/main/main.component';
import { ParticipantsComponent } from './components/main/participants/participants.component';
import { ResultDetailsComponent } from './components/main/results/result-details/result-details.component';
import { AgeGroupDistributionComponent } from './components/main/stats/age-group-distribution/age-group-distribution.component';
import { GenderDistributionComponent } from './components/main/stats/gender-distribution/gender-distribution.component';
import { StatsComponent } from './components/main/stats/stats.component';
import { ResultProgressionComponent } from './components/main/results/result-details/result-progression/result-progression.component';

@NgModule({
	declarations: [
		AppComponent,
		MainComponent,
		ParticipantsComponent,
		ResultDetailsComponent,
		StatsComponent,
		GenderDistributionComponent,
		AgeGroupDistributionComponent,
		ResultProgressionComponent
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		AppRoutingModule,
		HttpClientModule,
		FormsModule,
		ReactiveFormsModule,
		NgbModule,
		NgxSpinnerModule.forRoot({ type: 'ball-pulse-sync' })
	],
	providers: [],
	bootstrap: [AppComponent],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
