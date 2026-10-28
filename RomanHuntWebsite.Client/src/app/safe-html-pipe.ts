import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'safeHtml',
  standalone: false,
  pure: true
})
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }

  transform(value: string): SafeHtml {
    if (!value) return value;

    // 1. Replace HTML-encoded non-breaking spaces (&nbsp;) with standard spaces
    // 2. Replace raw unicode non-breaking spaces (\u00A0) with standard spaces
    const cleanHtml = value
      .replace(/&nbsp;/g, ' ')
      .replace(/\u00A0/g, ' ');

    return this.sanitizer.bypassSecurityTrustHtml(cleanHtml);  }
}

