import { testFixture } from './helpers';

describe('Direct usage', () => {
    it('should remove the variable', async () => {
        await testFixture('direct_usage/simple');
    });
});
