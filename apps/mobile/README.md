# Deep Breathing mobile app

This is the Expo SDK 58 mobile app for Deep Breathing. It is a member of the repository's pnpm
workspace; dependencies are installed from the root `pnpm-lock.yaml`. The mobile app is not a
standalone npm project and its old generated `package-lock.json` instructions are stale.

## Get started

1. From the repository root, install the locked workspace dependencies

   ```bash
   pnpm install --frozen-lockfile
   ```

2. Start the mobile app

   ```bash
   pnpm --filter mobile start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside `src/app`. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Xcode 27 simulator builds

SDK 58 generates the UIScene lifecycle required by iOS 27. Keep `ios/` generated and ignored.
Its CocoaPods hooks also raise resource bundle deployment targets for AsyncStorage and SDWebImage.

The root pnpm `packageExtensions` gives Reanimated an explicit React type peer.
This keeps mobile React 19 types separate from the website's React 18 types.
Use Node 22.13 or newer on the Node 22 line. Set `LANG=en_US.UTF-8` for CocoaPods.

From `apps/mobile`, regenerate the native project and try Expo first:

```bash
LANG=en_US.UTF-8 npx expo prebuild --platform ios --clean
npx expo run:ios --device <simulator-udid>
```

If Expo treats the simulator as physical and requests signing certificates, build explicitly:

```bash
xcodebuild -workspace ios/DeepBreathing.xcworkspace -scheme DeepBreathing \
  -configuration Debug -sdk iphonesimulator -destination 'id=<simulator-udid>' \
  -derivedDataPath ios/build CODE_SIGNING_ALLOWED=YES CODE_SIGN_IDENTITY=- CODE_SIGNING_REQUIRED=NO
xcrun simctl install <simulator-udid> ios/build/Build/Products/Debug-iphonesimulator/DeepBreathing.app
npx expo start --dev-client
```

Use Xcode simulator signing for SecureStore keychain entitlements. A fully unsigned build cannot initialize the auth client.
Open the installed app through the device tools. Leave `CI` unset for live reload.

## Local checks

Run these from the repository root so workspace links resolve correctly:

```bash
pnpm --filter mobile test
pnpm --filter mobile exec tsc --noEmit
pnpm --filter mobile lint
pnpm --dir apps/mobile dlx expo-doctor@1.21.6
```

The iOS release workflow runs the same checks with pinned Node/pnpm versions. EAS production
builds additionally require a clean Git commit; see `apps/mobile/eas.json` and the App Store
Build 18 checklist.

### Other setup steps

- For linting, run `pnpm --filter mobile lint`, or follow our guide on ["Using ESLint and Prettier"](https://docs.expo.dev/guides/using-eslint/)
- Unit tests run with Vitest via `pnpm --filter mobile test`.
- Learn more about the TypeScript setup in this template in our guide on ["Using TypeScript"](https://docs.expo.dev/guides/typescript/)

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
