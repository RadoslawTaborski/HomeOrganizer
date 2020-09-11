import { CamelCaseToSignPipe } from './camel-case-to-sign.pipe';

describe('CamelCaseToSignPipe', () => {
  it('create an instance', () => {
    const pipe = new CamelCaseToSignPipe();
    expect(pipe).toBeTruthy();
  });
});
