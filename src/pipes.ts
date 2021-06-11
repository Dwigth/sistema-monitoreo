import { NgModule } from '@angular/core';
import { ShortenUrlPipe } from './app/pages/main/sidemenu/shorten-url.pipe';
import { TruncatePipe } from './app/truncate.pipe';

@NgModule({
	declarations: [
		TruncatePipe,
        ShortenUrlPipe,
	],
	imports: [

	],
	exports: [
		TruncatePipe,
        ShortenUrlPipe
	]
})

export class Pipes { }