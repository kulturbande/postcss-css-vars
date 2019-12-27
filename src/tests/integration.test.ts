import postcss from 'postcss';
import plugin from '..';

async function run(input: string, output: string, opts: object) {
    const acceptedPlugin: postcss.AcceptedPlugin = plugin(opts);
    let result = await postcss([acceptedPlugin]).process(input, {
        from: undefined,
    });
    expect(result.css).toEqual(output);
    expect(result.warnings()).toHaveLength(0);
}

it('does something', async () => {
    await run('a{ --color: red; color: var(--color); }', 'a{ color: red; }', {});
});
