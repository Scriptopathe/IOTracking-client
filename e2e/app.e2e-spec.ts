import { IoTrackingPage } from './app.po';

describe('io-tracking App', function() {
  let page: IoTrackingPage;

  beforeEach(() => {
    page = new IoTrackingPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
