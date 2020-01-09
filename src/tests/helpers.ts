import { readFile } from 'fs';
import { join } from 'path';
import postcss from 'postcss';
import plugin from '..';

async function readFixture(name: string, postfix: string): Promise<string> {
    return new Promise((resolve, reject) => {
        readFile(
            join(__dirname, 'fixtures', name + '.' + postfix + '.css'),
            { encoding: 'UTF-8' },
            (err, data: string) => {
                if (err) {
                    reject(err);
                }
                resolve(data);
            }
        );
    });
}

export async function testFixture(fixtureName: string, opts: object = {}) {
    const acceptedPlugin: postcss.AcceptedPlugin = plugin(opts);
    const result = await postcss([acceptedPlugin]).process(await readFixture(fixtureName, 'input'), {
        from: undefined,
    });
    expect(result.css).toEqual(await readFixture(fixtureName, 'output'));
    expect(result.warnings()).toHaveLength(0);
}
