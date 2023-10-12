import { ShortenUrlPipe } from './shorten-url.pipe';

describe('ShortenUrlPipe', () => {
  it('create an instance', () => {
    const pipe = new ShortenUrlPipe();
    expect(pipe).toBeTruthy();
  });
});
