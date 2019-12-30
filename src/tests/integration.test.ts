import { testFixture } from './helpers';

describe('Direct usage', () => {
    it('should remove the variable', async () => {
        await testFixture('direct_usage/simple');
    });

    it('should preserve the declaration position', async () => {
        await testFixture('direct_usage/advanced');
    });
});
