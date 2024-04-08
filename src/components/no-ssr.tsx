import React from 'react'

import dynamic from 'next/dynamic'

export const NoSSR = dynamic(
  () =>
    Promise.resolve((props: any) => (
      <React.Fragment>{props.children}</React.Fragment>
    )),
  {
    ssr: false,
  }
)
