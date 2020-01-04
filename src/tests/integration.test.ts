import { testFixture } from './helpers';

describe('Direct usage', () => {
    it('should remove the variable', async () => {
        await testFixture('direct_usage/simple');
    });

    it('should preserve the declaration position', async () => {
        await testFixture('direct_usage/advanced');
    });

    it('should usable for multiple occasions', async () => {
        await testFixture('direct_usage/multiple_usage');
    });
});

describe('Root Level', () => {
    it('should basically work for :root - pseudo selector', async () => {
        await testFixture('root_level/root');
    });

    it('should basically work for body selector', async () => {
        await testFixture('root_level/body');
    });
});

describe('Permutation', () => {
    it('should create multiple classes', async () => {
        await testFixture('permutation/class');
    });

    it("should use global variables if the variable isn't available", async () => {
        await testFixture('permutation/multiple_variables');
    });
});

describe('Media Queries', () => {
    it('should support media queries', async () => {
        await testFixture('media_queries/simple');
    });

    it('should support simple multiple media queries', async () => {
        await testFixture('media_queries/multiple_media_queries');
    });

    it('should support media query with multiple variables', async () => {
        await testFixture('media_queries/media_query_multiple_variables');
    });

    it('should support multiple (complex) media queries', async () => {
        await testFixture('media_queries/multiple_complex');
    });
});
