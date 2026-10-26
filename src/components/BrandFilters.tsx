import React from "react";

/** Shared tone curve: original silhouettes and transparency, only brand pigments. */
export default function BrandFilters() {
  return (
    <svg className="brand-filter-definitions" width="0" height="0" aria-hidden="true" focusable="false">
      <defs>
        <filter id="brand-image-tones" colorInterpolationFilters="sRGB" x="0" y="0" width="100%" height="100%">
          <feColorMatrix type="matrix" values=".2126 .7152 .0722 0 0  .2126 .7152 .0722 0 0  .2126 .7152 .0722 0 0  0 0 0 1 0" />
          <feComponentTransfer>
            {/* Black → dim gray → terracotta → taupe → platinum → off-white. */}
            <feFuncR type="table" tableValues="0 .4 .784314 .6 .901961 .956863" />
            <feFuncG type="table" tableValues="0 .4 .415686 .6 .901961 .956863" />
            <feFuncB type="table" tableValues="0 .431373 .321569 .631373 .913725 .964706" />
          </feComponentTransfer>
        </filter>
        <filter id="brand-wallpaper-tones" colorInterpolationFilters="sRGB" x="0" y="0" width="100%" height="100%">
          <feColorMatrix in="SourceGraphic" type="matrix" values=".2126 .7152 .0722 0 0  .2126 .7152 .0722 0 0  .2126 .7152 .0722 0 0  0 0 0 1 0" />
          <feComponentTransfer result="neutral-wallpaper">
            <feFuncR type="table" tableValues="0 .18 .4 .6 .901961 .956863" />
            <feFuncG type="table" tableValues="0 .18 .4 .6 .901961 .956863" />
            <feFuncB type="table" tableValues="0 .194118 .431373 .631373 .913725 .964706" />
          </feComponentTransfer>
          {/* Extract only the edited warm edges; keep black negative space neutral. */}
          <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  3 -3 0 0 0" result="reflection-mask" />
          <feFlood floodColor="#c86a52" />
          <feComposite in2="reflection-mask" operator="in" />
          <feComposite in2="neutral-wallpaper" operator="over" />
        </filter>
      </defs>
    </svg>
  );
}
