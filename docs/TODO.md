## Publishing todo

- [ ] Add app splash + icon (general app polish)
    - [ ] Icon 1024x1024
    - [ ] Splash 1024x1024
    - [ ] Replace expo blue in app.json
    - [ ] Delete expo icon, replace with ios icon
- [ ] Ios bundler identifier
- [ ] Android package (lowercase-ify)
- [ ] Create app info/overview for publishing
- [ ] PostHog Analytics
- [ ] Expo notifications?

## Store config

- [ ] App store privacy manifest
- [ ] Fill eas.json + submit.production
- [ ] Host privacy policy on github pages

## Listing config

- [ ] App overview for publishing
    - [ ] Apple: name 30 / subtitle 30 / keyword 100 / description 4k
    - [ ] Play Store: title 30 / short 80 / full 4k
- [ ] Ss 1320x2868, 5-6x
- [ ] Play store graphic 1024x500
- [ ] Apple privacy questionnaire + Play Data Safety form
    - Location collected + shared (with open mateo)

## Feature todo

- [ ] Better equipment section
    - [ ] More equipment
    - [ ] Change UI selection
- [ ] Implement equipment clause to algorithm
    - [ ] Add "reasons" section as to why it was chosen (weighted ring?)
- [ ] Add more greetings
- [ ] Use image API to show object preview
- [ ] Switch hand images to proper png transparent ones
- [ ] Sort suggestions by apparent magnitude / important stars
- [ ] Extract weather caching into its own hook / useContext
- [ ] Code review: unspaghetify code, and align naming schemes
    - [x] Config prettier better
    - [ ] Scan repo for typos
    - [ ] Check dependencies / dev dependencies
    - [ ] Delete default assets
- [ ] Write AI disclossure
- [ ] Greetings => useMemo

## Feature wishlist (lower probability)

- [ ] Export "tonight" card

## Done

- [x] Open-Meteo CC-BY attribution (settings)
- [x] Add designer/programmer credits on settings page
- [x] Add license + notice (Apache 2)
- [x] Weather caching
- [x] Reorganize
- [x] Add red filter toggle
