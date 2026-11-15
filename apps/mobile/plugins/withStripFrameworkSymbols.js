const { withPodfile } = require('expo/config-plugins');

const MARKER = '# withStripFrameworkSymbols';

// CocoaPods embeds the prebuilt React, Hermes and Expo frameworks without
// stripping them, so Release builds ship about 12 MB of local symbols. `strip -x`
// keeps exported symbols, so dynamic linking is unaffected. The phase has to run
// after "[CP] Embed Pods Frameworks", which CocoaPods adds during integration,
// hence post_integrate rather than an Xcode project mod.
const HOOK = `
${MARKER}
post_integrate do |installer|
  phase_name = 'Strip local symbols from embedded frameworks'
  script = <<~'SH'
    if [ "$CONFIGURATION" != "Release" ]; then exit 0; fi
    FRAMEWORKS="$TARGET_BUILD_DIR/$FRAMEWORKS_FOLDER_PATH"
    [ -d "$FRAMEWORKS" ] || exit 0
    for framework in "$FRAMEWORKS"/*.framework; do
      binary="$framework/$(/usr/libexec/PlistBuddy -c 'Print :CFBundleExecutable' "$framework/Info.plist")"
      strip -x "$binary"
      if [ -n "$EXPANDED_CODE_SIGN_IDENTITY" ] && [ "$CODE_SIGNING_ALLOWED" != "NO" ]; then
        codesign --force --sign "$EXPANDED_CODE_SIGN_IDENTITY" --preserve-metadata=identifier,entitlements,flags "$framework"
      fi
    done
  SH
  installer.aggregate_targets.map(&:user_project).uniq.each do |project|
    project.native_targets.select { |t| t.product_type == 'com.apple.product-type.application' }.each do |target|
      phase = target.shell_script_build_phases.find { |p| p.name == phase_name } ||
        target.new_shell_script_build_phase(phase_name)
      phase.shell_script = script
      phase.always_out_of_date = '1'
      target.build_phases.move(phase, target.build_phases.count - 1)
    end
    project.save
  end
end
`;

module.exports = function withStripFrameworkSymbols(config) {
  return withPodfile(config, (config) => {
    if (!config.modResults.contents.includes(MARKER)) {
      config.modResults.contents += HOOK;
    }
    return config;
  });
};
