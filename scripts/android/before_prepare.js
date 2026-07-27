const run = require('cordova-res');
const utils = require('../utils.js');

module.exports = function () {
  return generateAndroidResources();
};

async function generateAndroidResources() {
  console.log('Generating icons and splashscreens for Android');

  // Same Launch Icon fallback as iOS: generate resources/icon.png from a simple icon if missing
  const launchIcon = await utils.ensureLaunchIcon();

  // Prefer explicit splash; if missing, reuse iOS helper so Android also gets a source
  let splashSource = utils.fileExists(utils.LAUNCH_SPLASH)
    ? utils.LAUNCH_SPLASH
    : null;
  if (!splashSource) {
    splashSource = await utils.ensureIosLaunchScreen(launchIcon);
  }

  const androidPlatform = {};
  if (launchIcon) {
    androidPlatform.icon = { sources: [launchIcon] };
  } else {
    console.warn('Skipping Android icon generation: no Launch Icon source.');
  }

  if (splashSource) {
    androidPlatform.splash = { sources: [splashSource] };
  } else {
    console.warn('Skipping Android splash generation: no splash source.');
  }

  if (!androidPlatform.icon && !androidPlatform.splash) {
    console.warn('Nothing to generate for Android — missing Launch Icon and splash.');
    return;
  }

  const options = {
    platforms: {
      android: androidPlatform,
    },
  };

  let tmpDir;
  try {
    tmpDir = utils.saveFiles('resources/android/icon', '.png');
    utils.saveFiles('resources/android/splash', '.png', tmpDir);

    await run(options);

    utils.restoreFiles(tmpDir, 'resources/android/icon', '.png');
    utils.restoreFiles(tmpDir, 'resources/android/splash', '.png');
    console.log('Android resources generation finished');
  } finally {
    try {
      if (tmpDir) {
        // fs.rmSync(tmpDir, { recursive: true });
      }
    } catch (e) {
      console.error(
        `An error has occurred while removing the temp folder at ${tmpDir}. Please remove it manually. Error: ${e}`
      );
    }
  }
}
