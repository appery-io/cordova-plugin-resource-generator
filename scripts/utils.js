const fs = require('fs');
const os = require('os');
const path = require('path');

const LAUNCH_ICON = 'resources/icon.png';
const LAUNCH_SPLASH = 'resources/splash.png';
const LAUNCH_ICON_SIZE = 1024;
const LAUNCH_SPLASH_SIZE = 2732;
/** Icon side length on the generated splash canvas (~37% of 2732). */
const SPLASH_ICON_TARGET = 1024;

/** App assets preferred over default resources/icon.png (Appery template). */
const PREFERRED_ICON_CANDIDATES = [
  'src/assets/icon/favicon.png',
  'www/assets/icon/favicon.png',
  'src/assets/icon/icon.png',
  'src/assets/images/icon.png',
  'www/assets/icon/icon.png',
];

const FALLBACK_ICON_CANDIDATES = [
  'resources/icon.jpg',
  'resources/ios/icon.png',
  'resources/android/icon.png',
];

module.exports = {
  saveFiles,
  restoreFiles,
  fileExists,
  resolveSharp,
  ensureLaunchIcon,
  ensureIosLaunchScreen,
  hasPreferredIcon,
  LAUNCH_ICON,
  LAUNCH_SPLASH,
};

function hasPreferredIcon() {
  return !!PREFERRED_ICON_CANDIDATES.find(fileExists);
}

function fileExists(filePath) {
  try {
    return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
  } catch (_) {
    return false;
  }
}

function resolveSharp() {
  const searchPaths = [
    process.cwd(),
    path.join(process.cwd(), 'node_modules', 'cordova-res'),
    path.join(__dirname, '..'),
    path.join(__dirname, '..', 'node_modules', 'cordova-res'),
  ];
  try {
    return require(require.resolve('sharp', { paths: searchPaths }));
  } catch (e) {
    throw new Error(
      'sharp is required to generate Launch Icon / splash from a source image. ' +
      'Install cordova-res (or sharp) in the project. ' + e.message
    );
  }
}

function saveFiles(srcDir, fileExtension, destDir) {
  if (destDir == null) {
    destDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cordova-res'));
    console.log('Temporary directory is ' + destDir);
  }

  if (fs.existsSync(srcDir)) {
    console.log('Saving ' + fileExtension + ' files from ' + srcDir + ' directory to ' + destDir);

    var targetDir = path.join(destDir, srcDir);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    var files = fs.readdirSync(srcDir);
    files.forEach(function (file) {
      var srcFile = path.join(srcDir, file);
      var destFile = path.join(targetDir, file);
      if (fs.statSync(srcFile).isFile()) {
        fs.copyFileSync(srcFile, destFile);
      }
    });
  }

  return destDir;
}

function restoreFiles(srcDir, destDir, fileExtension) {
  if (fs.existsSync(path.join(srcDir, destDir))) {
    console.log('Restoring ' + fileExtension + ' files from ' + srcDir + ' directory to ' + destDir);

    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    var files = fs.readdirSync(path.join(srcDir, destDir));
    files.forEach(function (file) {
      var srcFile = path.join(srcDir, destDir, file);
      var destFile = path.join(destDir, file);
      if (fs.statSync(srcFile).isFile()) {
        fs.copyFileSync(srcFile, destFile);
      }
    });
  }
}

/**
 * Resolve icon source for cordova-res.
 * Priority: app favicon/assets → resources/icon.png → other platform fallbacks.
 * Returns the path to use, or null if none can be created.
 */
async function ensureLaunchIcon() {
  const preferred = PREFERRED_ICON_CANDIDATES.find(fileExists);
  if (preferred) {
    console.log('Preferred icon source found: ' + preferred);
    return preferred;
  }

  if (fileExists(LAUNCH_ICON)) {
    console.log('Launch Icon found: ' + LAUNCH_ICON);
    return LAUNCH_ICON;
  }

  const source = FALLBACK_ICON_CANDIDATES.find(fileExists);
  if (!source) {
    console.warn(
      'Launch Icon missing (' + LAUNCH_ICON + ') and no simple icon fallback found. ' +
      'Looked for: ' +
      PREFERRED_ICON_CANDIDATES.concat(FALLBACK_ICON_CANDIDATES).join(', ')
    );
    return null;
  }

  console.log('Launch Icon missing — generating ' + LAUNCH_ICON + ' from simple icon: ' + source);
  const sharp = resolveSharp();
  fs.mkdirSync(path.dirname(LAUNCH_ICON), { recursive: true });

  await sharp(source)
    .resize(LAUNCH_ICON_SIZE, LAUNCH_ICON_SIZE, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    })
    .png()
    .toFile(LAUNCH_ICON);

  console.log('Generated Launch Icon: ' + LAUNCH_ICON);
  return LAUNCH_ICON;
}

/**
 * Resolve splash source for cordova-res.
 * Priority: generate from preferred app icon (favicon) → existing splash → generate from Launch Icon.
 * Returns splash path to use, or null if it cannot be created.
 */
async function ensureIosLaunchScreen(launchIconPath) {
  const preferredIcon = PREFERRED_ICON_CANDIDATES.find(fileExists);
  const iconPath = launchIconPath && fileExists(launchIconPath)
    ? launchIconPath
    : (preferredIcon || (fileExists(LAUNCH_ICON) ? LAUNCH_ICON : null));

  // App favicon/assets win over default Appery resources/splash.png
  if (preferredIcon && iconPath) {
    return generateSplashFromIcon(iconPath);
  }

  const existingSplash =
    [LAUNCH_SPLASH, 'resources/ios/splash.png', 'resources/splash.jpg']
      .find(fileExists) || null;

  if (existingSplash) {
    console.log('iOS launch screen source found: ' + existingSplash);
    return existingSplash;
  }

  if (!iconPath) {
    console.warn(
      'iOS launch screen missing (' + LAUNCH_SPLASH + ') and no Launch Icon available to generate it.'
    );
    return null;
  }

  return generateSplashFromIcon(iconPath);
}

async function generateSplashFromIcon(iconPath) {
  console.log('Generating ' + LAUNCH_SPLASH + ' from icon: ' + iconPath);

  const sharp = resolveSharp();
  fs.mkdirSync(path.dirname(LAUNCH_SPLASH), { recursive: true });

  const iconBuffer = await sharp(iconPath)
    .resize(SPLASH_ICON_TARGET, SPLASH_ICON_TARGET, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    })
    .png()
    .toBuffer();

  const left = Math.round((LAUNCH_SPLASH_SIZE - SPLASH_ICON_TARGET) / 2);
  const top = Math.round((LAUNCH_SPLASH_SIZE - SPLASH_ICON_TARGET) / 2);

  await sharp({
    create: {
      width: LAUNCH_SPLASH_SIZE,
      height: LAUNCH_SPLASH_SIZE,
      channels: 3,
      background: { r: 255, g: 255, b: 255 },
    },
  })
    .composite([{ input: iconBuffer, left: left, top: top }])
    .png()
    .toFile(LAUNCH_SPLASH);

  console.log('Generated launch screen: ' + LAUNCH_SPLASH);
  return LAUNCH_SPLASH;
}
