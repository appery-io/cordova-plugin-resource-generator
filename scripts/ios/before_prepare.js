const run = require('cordova-res');
const utils = require('../utils.js');

module.exports = function () {
  return generateIosResources();
};

async function generateIosResources() {
  console.log('Generating icons and splashscreens for iOS');

  const launchIcon = await utils.ensureLaunchIcon();
  const launchSplash = await utils.ensureIosLaunchScreen(launchIcon);

  const iosPlatform = {};
  if (launchIcon) {
    iosPlatform.icon = { sources: [launchIcon] };
  } else {
    console.warn('Skipping iOS icon generation: no Launch Icon source.');
  }

  if (launchSplash) {
    iosPlatform.splash = { sources: [launchSplash] };
  } else {
    console.warn('Skipping iOS splash generation: no launch screen source.');
  }

  if (!iosPlatform.icon && !iosPlatform.splash) {
    console.warn('Nothing to generate for iOS — missing Launch Icon and launch screen.');
    return;
  }

  const options = {
    platforms: {
      ios: iosPlatform,
    },
  };

  let tmpDir;
  try {
    const preferAppIcon = utils.hasPreferredIcon();
    // When regenerating from favicon, do not restore old platform assets —
    // restore would undo cordova-res output.
    if (!preferAppIcon) {
      tmpDir = utils.saveFiles('resources/ios/icon', '.png');
      utils.saveFiles('resources/ios/splash', '.png', tmpDir);
    }

    await run(options);

    if (!preferAppIcon && tmpDir) {
      utils.restoreFiles(tmpDir, 'resources/ios/icon', '.png');
      utils.restoreFiles(tmpDir, 'resources/ios/splash', '.png');
    }
    console.log('iOS resources generation finished');
  } finally {
    try {
      if (tmpDir) {
        // Keep temp dir for debugging; cordova-res may still need files briefly.
        // fs.rmSync(tmpDir, { recursive: true });
      }
    } catch (e) {
      console.error(
        `An error has occurred while removing the temp folder at ${tmpDir}. Please remove it manually. Error: ${e}`
      );
    }
  }
}
