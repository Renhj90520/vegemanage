import { VegeManagePage } from './app.po';

describe('vege-manage App', function() {
  let page: VegeManagePage;

  beforeEach(() => {
    page = new VegeManagePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
