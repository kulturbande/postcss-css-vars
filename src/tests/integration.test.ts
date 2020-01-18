import { testFixture } from './helpers';

describe('Direct usage', () => {
    it('should remove the variable', async () => {
        await testFixture('direct_usage/simple');
    });

    it('should preserve the declaration position', async () => {
        await testFixture('direct_usage/advanced');
    });

    it('should be usable for multiple occasions', async () => {
        await testFixture('direct_usage/multiple_usage');
    });

    it('should work with multiple variables that are not ordered', async () => {
        await testFixture('direct_usage/many_variables');
    });

    it('should support multiple getters for the same declaration', async () => {
        await testFixture('direct_usage/multiple_getters');
    });

    it('should support multiple selectors with the same variable', async () => {
        await testFixture('direct_usage/two_selectors');
    });
});

describe('Root Level', () => {
    it('should basically work for :root - pseudo selector', async () => {
        await testFixture('root_level/root');
    });

    it('should basically work for body selector', async () => {
        await testFixture('root_level/body');
    });

    it('should overwrite variables if they registered twice', async () => {
        await testFixture('root_level/multiple_setter');
    });

    it('should leave the body intact, if it is not empty', async () => {
        await testFixture('root_level/body_intact');
    });

    it('should allow multiple root definitions', async () => {
        await testFixture('root_level/multiple_root');
    });
});

describe('Permutation', () => {
    it('should create multiple classes', async () => {
        await testFixture('permutation/class');
    });

    it("should use global variables if the variable isn't available", async () => {
        await testFixture('permutation/multiple_variables');
    });

    it('should use class permutations for multiple setter', async () => {
        await testFixture('permutation/class_permutation');
    });

    it('should work with multiple, overlaying variables', async () => {
        await testFixture('permutation/complex');
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
