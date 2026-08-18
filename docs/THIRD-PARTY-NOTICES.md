# Third-Party Notices

Polaris bundles or depends on the third-party software and data listed below.
Each item is reproduced with the notice its licence requires. Polaris itself is licensed under the Apache License 2.0; see `LICENSE` and `NOTICE`.

This file covers the source distribution and the compiled application. A user-facing summary of the same list appears in the app under **Settings → About → Built on**.

Last reviewed: 2026-08-18 // Polaris 1.0.0

---

## Contents

1. [Fonts](#1-fonts)
2. [Icon artwork](#2-icon-artwork)
3. [Data sources](#3-data-sources)
4. [Software dependencies](#4-software-dependencies)

---

## 1. Fonts

### Sansation

Bundled as `assets/fonts/Sansation-Regular.ttf`.
Designed by Bernd Montag. Licensed under the SIL Open Font License, Version 1.1.

The font file is embedded unmodified. "Sansation" is a Reserved Font Name under the OFL: any modified version of this font distributed by this project must be renamed.

```
Copyright (c) 2011 by Bernd Montag, with Reserved Font Name 'Sansation'

This Font Software is licensed under the SIL Open Font License, Version 1.1.
This license is copied below, and is also available with a FAQ at:
http://scripts.sil.org/OFL


-----------------------------------------------------------
SIL OPEN FONT LICENSE Version 1.1 - 26 February 2007
-----------------------------------------------------------

PREAMBLE
The goals of the Open Font License (OFL) are to stimulate worldwide
development of collaborative font projects, to support the font creation
efforts of academic and linguistic communities, and to provide a free and
open framework in which fonts may be shared and improved in partnership
with others.

The OFL allows the licensed fonts to be used, studied, modified and
redistributed freely as long as they are not sold by themselves. The
fonts, including any derivative works, can be bundled, embedded, 
redistributed and/or sold with any software provided that any reserved
names are not used by derivative works. The fonts and derivatives,
however, cannot be released under any other type of license. The
requirement for fonts to remain under this license does not apply
to any document created using the fonts or their derivatives.

DEFINITIONS
"Font Software" refers to the set of files released by the Copyright
Holder(s) under this license and clearly marked as such. This may
include source files, build scripts and documentation.

"Reserved Font Name" refers to any names specified as such after the
copyright statement(s).

"Original Version" refers to the collection of Font Software components as
distributed by the Copyright Holder(s).

"Modified Version" refers to any derivative made by adding to, deleting,
or substituting -- in part or in whole -- any of the components of the
Original Version, by changing formats or by porting the Font Software to a
new environment.

"Author" refers to any designer, engineer, programmer, technical
writer or other person who contributed to the Font Software.

PERMISSION & CONDITIONS
Permission is hereby granted, free of charge, to any person obtaining
a copy of the Font Software, to use, study, copy, merge, embed, modify,
redistribute, and sell modified and unmodified copies of the Font
Software, subject to the following conditions:

1) Neither the Font Software nor any of its individual components,
in Original or Modified Versions, may be sold by itself.

2) Original or Modified Versions of the Font Software may be bundled,
redistributed and/or sold with any software, provided that each copy
contains the above copyright notice and this license. These can be
included either as stand-alone text files, human-readable headers or
in the appropriate machine-readable metadata fields within text or
binary files as long as those fields can be easily viewed by the user.

3) No Modified Version of the Font Software may use the Reserved Font
Name(s) unless explicit written permission is granted by the corresponding
Copyright Holder. This restriction only applies to the primary font name as
presented to the users.

4) The name(s) of the Copyright Holder(s) or the Author(s) of the Font
Software shall not be used to promote, endorse or advertise any
Modified Version, except to acknowledge the contribution(s) of the
Copyright Holder(s) and the Author(s) or with their explicit written
permission.

5) The Font Software, modified or unmodified, in part or in whole,
must be distributed entirely under this license, and must not be
distributed under any other license. The requirement for fonts to
remain under this license does not apply to any document created
using the Font Software.

TERMINATION
This license becomes null and void if any of the above conditions are
not met.

DISCLAIMER
THE FONT SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT
OF COPYRIGHT, PATENT, TRADEMARK, OR OTHER RIGHT. IN NO EVENT SHALL THE
COPYRIGHT HOLDER BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
INCLUDING ANY GENERAL, SPECIAL, INDIRECT, INCIDENTAL, OR CONSEQUENTIAL
DAMAGES, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF THE USE OR INABILITY TO USE THE FONT SOFTWARE OR FROM
OTHER DEALINGS IN THE FONT SOFTWARE.
```

---

## 2. Icon artwork

### Lucide and @lucide/lab

Icon path data is copied into `src/components/icon.tsx` rather than imported as a package dependency. The icons taken from these projects are:

`arrowUpDown`, `astroid`, `check`, `chevronRight`, `cloud`, `comet`, `droplet`,
`frown`, `info`, `mapPin`, `meh`, `moon`, `nebula`, `orbit`, `planet`, `plus`,
`satellite`, `smile`, `sun`, `sunrise`, `trash`, `x`.

Some of these icons originate in the Feather project and carry a separate MIT
notice, reproduced in the Lucide licence below.

#### Lucide

```
ISC License

Copyright (c) 2026 Lucide Icons and Contributors

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

---

The following Lucide icons are derived from the Feather project:

airplay, alert-circle, alert-octagon, alert-triangle, aperture, arrow-down-circle, arrow-down-left, arrow-down-right, arrow-down, arrow-left-circle, arrow-left, arrow-right-circle, arrow-right, arrow-up-circle, arrow-up-left, arrow-up-right, arrow-up, at-sign, calendar, cast, check, chevron-down, chevron-left, chevron-right, chevron-up, chevrons-down, chevrons-left, chevrons-right, chevrons-up, circle, clipboard, clock, code, columns, command, compass, corner-down-left, corner-down-right, corner-left-down, corner-left-up, corner-right-down, corner-right-up, corner-up-left, corner-up-right, crosshair, database, divide-circle, divide-square, dollar-sign, download, external-link, feather, frown, hash, headphones, help-circle, info, italic, key, layout, life-buoy, link-2, link, loader, lock, log-in, log-out, maximize, meh, minimize, minimize-2, minus-circle, minus-square, minus, monitor, moon, more-horizontal, more-vertical, move, music, navigation-2, navigation, octagon, pause-circle, percent, plus-circle, plus-square, plus, power, radio, rss, search, server, share, shopping-bag, sidebar, smartphone, smile, square, table-2, tablet, target, terminal, trash-2, trash, triangle, tv, type, upload, x-circle, x-octagon, x-square, x, zoom-in, zoom-out

The MIT License (MIT) (for the icons listed above)

Copyright (c) 2013-present Cole Bemis

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

#### @lucide/lab

```
ISC License

Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
```

---

## 3. Data sources

### Open-Meteo

Weather forecasts and place-name geocoding are retrieved at runtime from
`api.open-meteo.com` and `geocoding-api.open-meteo.com`.

Open-Meteo data is provided under the **Creative Commons Attribution 4.0
International licence (CC BY 4.0)**:
<https://creativecommons.org/licenses/by/4.0/>

Attribution: *Weather data by [Open-Meteo.com](https://open-meteo.com/)*.

Polaris uses the free API tier, which Open-Meteo makes available for non-commercial use. Polaris is distributed free of charge with no advertising, no in-app purchases and no paid tier. Open-Meteo data is transformed by Polaris into its own observing-condition scores; those scores are derived work, not redistributed Open-Meteo data.

However, all places where Open-Meteo data is used are specifically marked as such.

---

## 4. Software dependencies

The following npm packages are distributed with the compiled application. All are licensed under the MIT License. The copyright notices are reproduced below, followed by a single copy of the licence text that applies to each of them.

**astronomy-engine**

> Copyright (c) 2019-2025 Don Cross <cosinekitty@gmail.com>

**expo, expo-constants, expo-device, expo-file-system, expo-font,
  expo-glass-effect, expo-image, expo-image-picker, expo-linking,
  expo-location, expo-router, expo-splash-screen, expo-sqlite,
  expo-status-bar, expo-symbols, expo-system-ui, expo-updates,
  expo-web-browser**

> Copyright (c) 2015-present 650 Industries, Inc. (aka Expo)

**react, react-native**

> Copyright (c) Meta Platforms, Inc. and affiliates.

**react-native-gesture-handler**

> Copyright (c) 2016 Software Mansion <swmansion.com>

**react-native-reanimated**

> Copyright (c) 2016 Software Mansion <swmansion.com>

**react-native-screens**

> Copyright (c) 2018 Software Mansion <swmansion.com>

**react-native-worklets**

> Copyright (c) Software Mansion <swmansion.com>

**react-native-svg**

> Copyright (c) [2015-2016] [Horcrux]

**react-native-safe-area-context**

> Copyright (c) 2019 Th3rd Wave

**nativewind, react-native-css**

> Copyright (c) 2023 Mark Lawlor

**tailwind-merge**

> Copyright (c) 2021 Dany Castillo

**tailwind-variants**

> Copyright (c) 2020 Tailwind Variants

### MIT License

```
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## Notes on scope

- Transitive dependencies of the packages above carry their own notices. A complete machine-generated inventory can be produced from the lockfile with a licence-scanning tool; the list here covers direct dependencies.
- Build-time-only tooling (TypeScript, Prettier, PostCSS, Tailwind CSS and the Expo CLI) is not distributed with the application and is not listed.
- Corrections and omissions: please open an issue at <https://github.com/B1j2754/Polaris>.