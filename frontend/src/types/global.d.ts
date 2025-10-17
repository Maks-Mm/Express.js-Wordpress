// global.d.ts
declare module '*.jsx' {
  import React from 'react';
  const Component: React.ComponentType;
  export default Component;
}