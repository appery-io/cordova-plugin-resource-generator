'use strict';

const fs = require('fs');
const path = require('path');

// Sizes match cordova-res 0.15.4, which is what Appery config.xml files reference.
const CATALOG = {
    'drawable-ldpi-icon.png': { width: 36, height: 36, kind: 'icon' },
    'drawable-mdpi-icon.png': { width: 48, height: 48, kind: 'icon' },
    'drawable-hdpi-icon.png': { width: 72, height: 72, kind: 'icon' },
    'drawable-xhdpi-icon.png': { width: 96, height: 96, kind: 'icon' },
    'drawable-xxhdpi-icon.png': { width: 144, height: 144, kind: 'icon' },
    'drawable-xxxhdpi-icon.png': { width: 192, height: 192, kind: 'icon' },
    'ldpi-foreground.png': { width: 81, height: 81, kind: 'icon' },
    'mdpi-foreground.png': { width: 108, height: 108, kind: 'icon' },
    'hdpi-foreground.png': { width: 162, height: 162, kind: 'icon' },
    'xhdpi-foreground.png': { width: 216, height: 216, kind: 'icon' },
    'xxhdpi-foreground.png': { width: 324, height: 324, kind: 'icon' },
    'xxxhdpi-foreground.png': { width: 432, height: 432, kind: 'icon' },
    'ldpi-background.png': { width: 81, height: 81, kind: 'icon' },
    'mdpi-background.png': { width: 108, height: 108, kind: 'icon' },
    'hdpi-background.png': { width: 162, height: 162, kind: 'icon' },
    'xhdpi-background.png': { width: 216, height: 216, kind: 'icon' },
    'xxhdpi-background.png': { width: 324, height: 324, kind: 'icon' },
    'xxxhdpi-background.png': { width: 432, height: 432, kind: 'icon' },
    'ldpi-monochrome.png': { width: 81, height: 81, kind: 'icon' },
    'mdpi-monochrome.png': { width: 108, height: 108, kind: 'icon' },
    'hdpi-monochrome.png': { width: 162, height: 162, kind: 'icon' },
    'xhdpi-monochrome.png': { width: 216, height: 216, kind: 'icon' },
    'xxhdpi-monochrome.png': { width: 324, height: 324, kind: 'icon' },
    'xxxhdpi-monochrome.png': { width: 432, height: 432, kind: 'icon' },
    'drawable-land-ldpi-screen.png': { width: 320, height: 240, kind: 'splash' },
    'drawable-land-mdpi-screen.png': { width: 480, height: 320, kind: 'splash' },
    'drawable-land-hdpi-screen.png': { width: 800, height: 480, kind: 'splash' },
    'drawable-land-xhdpi-screen.png': { width: 1280, height: 720, kind: 'splash' },
    'drawable-land-xxhdpi-screen.png': { width: 1600, height: 960, kind: 'splash' },
    'drawable-land-xxxhdpi-screen.png': { width: 1920, height: 1280, kind: 'splash' },
    'drawable-port-ldpi-screen.png': { width: 240, height: 320, kind: 'splash' },
    'drawable-port-mdpi-screen.png': { width: 320, height: 480, kind: 'splash' },
    'drawable-port-hdpi-screen.png': { width: 480, height: 800, kind: 'splash' },
    'drawable-port-xhdpi-screen.png': { width: 720, height: 1280, kind: 'splash' },
    'drawable-port-xxhdpi-screen.png': { width: 960, height: 1600, kind: 'splash' },
    'drawable-port-xxxhdpi-screen.png': { width: 1280, height: 1920, kind: 'splash' },
    'icon-20.png': { width: 20, height: 20, kind: 'icon' },
    'icon-20@2x.png': { width: 40, height: 40, kind: 'icon' },
    'icon-20@3x.png': { width: 60, height: 60, kind: 'icon' },
    'icon-24@2x.png': { width: 48, height: 48, kind: 'icon' },
    'icon-27.5@2x.png': { width: 55, height: 55, kind: 'icon' },
    'icon-29.png': { width: 29, height: 29, kind: 'icon' },
    'icon-29@2x.png': { width: 58, height: 58, kind: 'icon' },
    'icon-29@3x.png': { width: 87, height: 87, kind: 'icon' },
    'icon-40.png': { width: 40, height: 40, kind: 'icon' },
    'icon-40@2x.png': { width: 80, height: 80, kind: 'icon' },
    'icon-40@3x.png': { width: 120, height: 120, kind: 'icon' },
    'icon-44@2x.png': { width: 88, height: 88, kind: 'icon' },
    'icon-50.png': { width: 50, height: 50, kind: 'icon' },
    'icon-50@2x.png': { width: 100, height: 100, kind: 'icon' },
    'icon-57.png': { width: 57, height: 57, kind: 'icon' },
    'icon-57@2x.png': { width: 114, height: 114, kind: 'icon' },
    'icon-60.png': { width: 60, height: 60, kind: 'icon' },
    'icon-60@2x.png': { width: 120, height: 120, kind: 'icon' },
    'icon-60@3x.png': { width: 180, height: 180, kind: 'icon' },
    'icon-72.png': { width: 72, height: 72, kind: 'icon' },
    'icon-72@2x.png': { width: 144, height: 144, kind: 'icon' },
    'icon-76.png': { width: 76, height: 76, kind: 'icon' },
    'icon-76@2x.png': { width: 152, height: 152, kind: 'icon' },
    'icon-83.5@2x.png': { width: 167, height: 167, kind: 'icon' },
    'icon-86@2x.png': { width: 172, height: 172, kind: 'icon' },
    'icon-98@2x.png': { width: 196, height: 196, kind: 'icon' },
    'icon-1024.png': { width: 1024, height: 1024, kind: 'icon' },
    'icon-108@2x.png': { width: 216, height: 216, kind: 'icon' },
    'icon-small.png': { width: 29, height: 29, kind: 'icon' },
    'icon-small@2x.png': { width: 58, height: 58, kind: 'icon' },
    'icon-small@3x.png': { width: 87, height: 87, kind: 'icon' },
    'icon.png': { width: 57, height: 57, kind: 'icon' },
    'icon@2x.png': { width: 114, height: 114, kind: 'icon' },
    'Default-568h@2x~iphone.png': { width: 640, height: 1136, kind: 'splash' },
    'Default-667h.png': { width: 750, height: 1334, kind: 'splash' },
    'Default-2688h~iphone.png': { width: 1242, height: 2688, kind: 'splash' },
    'Default-Landscape-2688h~iphone.png': { width: 2688, height: 1242, kind: 'splash' },
    'Default-1792h~iphone.png': { width: 828, height: 1792, kind: 'splash' },
    'Default-Landscape-1792h~iphone.png': { width: 1792, height: 828, kind: 'splash' },
    'Default-2436h.png': { width: 1125, height: 2436, kind: 'splash' },
    'Default-Landscape-2436h.png': { width: 2436, height: 1125, kind: 'splash' },
    'Default-736h.png': { width: 1242, height: 2208, kind: 'splash' },
    'Default-Landscape-736h.png': { width: 2208, height: 1242, kind: 'splash' },
    'Default-Landscape@2x~ipad.png': { width: 2048, height: 1536, kind: 'splash' },
    'Default-Landscape@~ipadpro.png': { width: 2732, height: 2048, kind: 'splash' },
    'Default-Landscape~ipad.png': { width: 1024, height: 768, kind: 'splash' },
    'Default-Portrait@2x~ipad.png': { width: 1536, height: 2048, kind: 'splash' },
    'Default-Portrait@~ipadpro.png': { width: 2048, height: 2732, kind: 'splash' },
    'Default-Portrait~ipad.png': { width: 768, height: 1024, kind: 'splash' },
    'Default@2x~iphone.png': { width: 640, height: 960, kind: 'splash' },
    'Default~iphone.png': { width: 320, height: 480, kind: 'splash' },
    'Default@2x~universal~anyany.png': { width: 2732, height: 2732, kind: 'splash' }
};

const ICON_DENSITY = {
    ldpi: [36, 36],
    mdpi: [48, 48],
    hdpi: [72, 72],
    xhdpi: [96, 96],
    xxhdpi: [144, 144],
    xxxhdpi: [192, 192]
};

const ADAPTIVE_DENSITY = {
    ldpi: [81, 81],
    mdpi: [108, 108],
    hdpi: [162, 162],
    xhdpi: [216, 216],
    xxhdpi: [324, 324],
    xxxhdpi: [432, 432]
};

const SPLASH_DENSITY = {
    'land-ldpi': [320, 240],
    'land-mdpi': [480, 320],
    'land-hdpi': [800, 480],
    'land-xhdpi': [1280, 720],
    'land-xxhdpi': [1600, 960],
    'land-xxxhdpi': [1920, 1280],
    'port-ldpi': [240, 320],
    'port-mdpi': [320, 480],
    'port-hdpi': [480, 800],
    'port-xhdpi': [720, 1280],
    'port-xxhdpi': [960, 1600],
    'port-xxxhdpi': [1280, 1920]
};

const completedProjects = new Set();
let pending = null;

function generate(ctx) {
    const projectRoot = resolveProjectRoot(ctx);
    if (projectRoot && completedProjects.has(projectRoot)) {
        return Promise.resolve();
    }
    if (!pending) {
        pending = ensureResources(ctx)
            .then(function (root) {
                if (root) completedProjects.add(root);
            })
            .finally(function () {
                pending = null;
            });
    }
    return pending;
}

module.exports = generate;

if (require.main === module) {
    generate().catch(function (err) {
        console.error('cordova-plugin-resource-generator: ' + (err && err.stack ? err.stack : err));
        process.exit(1);
    });
}

async function ensureResources(ctx) {
    const projectRoot = resolveProjectRoot(ctx);
    if (!projectRoot) {
        return null;
    }

    const configPath = resolveConfigPath(projectRoot);
    if (!configPath) {
        return projectRoot;
    }

    const xml = fs.readFileSync(configPath, 'utf8');
    const missing = uniqueMissing(projectRoot, parseImageReferences(xml));
    if (missing.length === 0) {
        console.log('cordova-plugin-resource-generator: all referenced images already exist');
        return projectRoot;
    }

    const sharp = loadSharp(projectRoot);
    const defaultIcon = path.join(__dirname, '..', 'assets', 'default-icon.png');
    if (!fs.existsSync(defaultIcon)) {
        throw new Error('Bundled default icon is missing: ' + defaultIcon);
    }

    for (const ref of missing) {
        const source = pickSource(ref, projectRoot, defaultIcon);
        const dest = path.resolve(projectRoot, ref.src);
        if (fs.existsSync(dest)) continue;
        const size = await resolveSize(sharp, ref, source);
        await render(sharp, source, dest, size, shouldFlatten(ref), isSplashRef(ref) && !isSplashMaster(source, projectRoot));
        console.log('cordova-plugin-resource-generator: created ' + ref.src +
            ' (' + size.width + 'x' + size.height + ') from ' + path.basename(source));
    }

    return projectRoot;
}

function resolveProjectRoot(ctx) {
    const fromContext = ctx && ctx.opts && ctx.opts.projectRoot;
    if (fromContext && isCordovaProject(fromContext)) {
        return path.resolve(fromContext);
    }
    const seeds = [process.env.INIT_CWD, process.cwd(), __dirname];
    for (let i = 0; i < seeds.length; i++) {
        const found = walkForConfig(seeds[i]);
        if (found) return found;
    }
    return null;
}

function walkForConfig(start) {
    if (!start) return null;
    let dir = path.resolve(start);
    const root = path.parse(dir).root;
    while (true) {
        if (isCordovaProject(dir)) return dir;
        if (dir === root) return null;
        dir = path.dirname(dir);
    }
}

function isCordovaProject(dir) {
    return fs.existsSync(path.join(dir, 'config.xml')) ||
        fs.existsSync(path.join(dir, 'www', 'config.xml'));
}

function resolveConfigPath(projectRoot) {
    const rootConfig = path.join(projectRoot, 'config.xml');
    if (fs.existsSync(rootConfig)) return rootConfig;
    const wwwConfig = path.join(projectRoot, 'www', 'config.xml');
    if (fs.existsSync(wwwConfig)) return wwwConfig;
    return null;
}

function parseImageReferences(xml) {
    const withoutComments = xml.replace(/<!--[\s\S]*?-->/g, '');
    const refs = [];
    const platformRe = /<platform\b([^>]*)>([\s\S]*?)<\/platform>/gi;
    let match;
    while ((match = platformRe.exec(withoutComments))) {
        collectTags(match[2], attr(match[1], 'name'), refs);
    }
    collectTags(withoutComments.replace(/<platform\b[\s\S]*?<\/platform>/gi, ''), null, refs);
    return refs;
}

function collectTags(fragment, platform, refs) {
    const tagRe = /<(icon|splash|resource-file)\b([^>]*?)\/?>/gi;
    let match;
    while ((match = tagRe.exec(fragment))) {
        const tag = match[1].toLowerCase();
        const attrs = parseAttrs(match[2]);
        const keys = tag === 'resource-file'
            ? ['src']
            : ['src', 'foreground', 'background', 'monochrome'];
        keys.forEach(function (key) {
            if (!isLocalImage(attrs[key])) return;
            refs.push({
                src: attrs[key],
                platform: platform,
                tag: tag,
                role: key,
                width: attrs.width,
                height: attrs.height,
                density: (attrs.density || '').toLowerCase()
            });
        });
    }
}

function parseAttrs(source) {
    const attrs = {};
    const re = /([\w:.-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
    let match;
    while ((match = re.exec(source))) {
        attrs[match[1]] = match[2] !== undefined ? match[2] : match[3];
    }
    return attrs;
}

function attr(source, name) {
    return parseAttrs(source)[name] || null;
}

function isLocalImage(value) {
    if (!value) return false;
    const trimmed = String(value).trim();
    if (!trimmed || trimmed.charAt(0) === '@' || /^[a-z][a-z0-9+.-]*:/i.test(trimmed)) return false;
    if (/\.9\.png$/i.test(trimmed)) return false;
    return /\.(png|jpe?g|webp)$/i.test(trimmed);
}

function uniqueMissing(projectRoot, refs) {
    const seen = new Set();
    const missing = [];
    refs.forEach(function (ref) {
        const dest = path.resolve(projectRoot, ref.src);
        if (seen.has(dest) || fs.existsSync(dest)) return;
        seen.add(dest);
        missing.push(ref);
    });
    return missing;
}

function pickSource(ref, projectRoot, defaultIcon) {
    const masterIcon = path.join(projectRoot, 'resources', 'icon.png');
    const masterSplash = path.join(projectRoot, 'resources', 'splash.png');
    const dest = path.resolve(projectRoot, ref.src);
    if (isSplashRef(ref) && fs.existsSync(masterSplash) && path.resolve(masterSplash) !== dest) {
        return masterSplash;
    }
    if (fs.existsSync(masterIcon) && path.resolve(masterIcon) !== dest) {
        return masterIcon;
    }
    return defaultIcon;
}

function isSplashRef(ref) {
    if (ref.tag === 'splash') return true;
    const rel = ref.src.replace(/\\/g, '/');
    if (/\/splash\//i.test(rel)) return true;
    const known = CATALOG[path.basename(ref.src)];
    return !!(known && known.kind === 'splash');
}

function isSplashMaster(source, projectRoot) {
    return path.resolve(source) === path.resolve(projectRoot, 'resources', 'splash.png');
}

function shouldFlatten(ref) {
    return ref.platform === 'ios' && ref.tag === 'icon' && ref.role === 'src';
}

async function resolveSize(sharp, ref, source) {
    const explicitWidth = Number(ref.width);
    const explicitHeight = Number(ref.height);
    if (explicitWidth > 0 && explicitHeight > 0) {
        return { width: Math.round(explicitWidth), height: Math.round(explicitHeight) };
    }

    const rel = ref.src.replace(/\\/g, '/');
    const base = path.basename(rel);
    if (!isMasterImage(rel) && CATALOG[base]) {
        return { width: CATALOG[base].width, height: CATALOG[base].height };
    }

    const fromDensity = sizeFromDensity(ref, rel, base);
    if (fromDensity) return fromDensity;

    const fromWindows = sizeFromWindowsName(base);
    if (fromWindows) return fromWindows;

    const meta = await sharp(source).metadata();
    const width = meta.width || 512;
    const height = meta.height || 512;
    return { width: width, height: height };
}

function isMasterImage(rel) {
    return /(?:^|\/)resources\/(?:icon|splash)\.(png|jpe?g|webp)$/i.test(rel);
}

function sizeFromDensity(ref, rel, base) {
    const density = ref.density || densityFromPath(rel);
    if (!density) return null;
    const adaptive = ref.role === 'foreground' || ref.role === 'background' || ref.role === 'monochrome' ||
        /(foreground|background|monochrome)/i.test(base);
    const table = ref.tag === 'splash' || isSplashRef(ref)
        ? SPLASH_DENSITY
        : (adaptive ? ADAPTIVE_DENSITY : ICON_DENSITY);
    const pair = table[density];
    if (!pair) return null;
    return { width: pair[0], height: pair[1] };
}

function densityFromPath(rel) {
    const match = rel.match(/(?:drawable|mipmap)-((?:land-|port-)?(?:xxxhdpi|xxhdpi|xhdpi|hdpi|mdpi|ldpi))/i);
    return match ? match[1].toLowerCase() : null;
}

function sizeFromWindowsName(base) {
    const logo = base.match(/^(?:Square|Wide|StoreLogo)?(\d+)x(\d+).*(?:scale-(\d+))?/i);
    if (logo && /Logo|StoreLogo/i.test(base)) {
        const factor = logo[3] ? Number(logo[3]) / 100 : 1;
        return {
            width: Math.round(Number(logo[1]) * factor),
            height: Math.round(Number(logo[2]) * factor)
        };
    }
    const splash = base.match(/^Splash(?:\.scale-(\d+))?\.png$/i);
    if (splash) {
        const factor = splash[1] ? Number(splash[1]) / 100 : 1;
        return { width: Math.round(620 * factor), height: Math.round(300 * factor) };
    }
    return null;
}

function loadSharp(projectRoot) {
    const candidates = [
        'sharp',
        path.join(__dirname, '..', 'node_modules', 'sharp'),
        path.join(projectRoot, 'node_modules', 'sharp'),
        path.join(projectRoot, 'node_modules', 'cordova-plugin-resource-generator', 'node_modules', 'sharp')
    ];
    let lastError;
    for (let i = 0; i < candidates.length; i++) {
        try {
            return require(candidates[i]);
        } catch (err) {
            lastError = err;
        }
    }
    throw new Error('Cannot load sharp, which is required to generate missing icons. ' +
        (lastError ? lastError.message : ''));
}

async function render(sharp, source, dest, size, flatten, contain) {
    const input = await fs.promises.readFile(source);
    let pipeline = sharp(input, { failOn: 'none' });
    if (flatten) {
        pipeline = pipeline.flatten({ background: '#ffffff' });
    }
    const options = {
        width: size.width,
        height: size.height,
        fit: contain && size.width !== size.height ? 'contain' : 'cover',
        position: 'centre'
    };
    if (options.fit === 'contain') {
        options.background = await cornerColor(sharp, input);
    }
    pipeline = pipeline.resize(options);
    const format = formatFor(dest);
    if (format === 'jpeg') pipeline = pipeline.jpeg({ quality: 90 });
    else if (format === 'webp') pipeline = pipeline.webp({ quality: 90 });
    else pipeline = pipeline.png();

    await fs.promises.mkdir(path.dirname(dest), { recursive: true });
    const tmp = dest + '.generating';
    try {
        await pipeline.toFile(tmp);
        await fs.promises.rename(tmp, dest);
    } catch (err) {
        if (fs.existsSync(tmp)) {
            try { fs.unlinkSync(tmp); } catch (ignore) { /* leave the original error */ }
        }
        throw err;
    }
}

async function cornerColor(sharp, input) {
    const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    if (!info.width || !info.channels) {
        return { r: 255, g: 255, b: 255, alpha: 1 };
    }
    const alpha = data[3];
    if (alpha < 16) return { r: 255, g: 255, b: 255, alpha: 1 };
    return { r: data[0], g: data[1], b: data[2], alpha: 1 };
}

function formatFor(dest) {
    if (/\.jpe?g$/i.test(dest)) return 'jpeg';
    if (/\.webp$/i.test(dest)) return 'webp';
    return 'png';
}
