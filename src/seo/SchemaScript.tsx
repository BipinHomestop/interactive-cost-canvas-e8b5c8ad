
import React from 'react';
import { schemaData } from './schema-data';

export const SchemaScript: React.FC = () => {
  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify(schemaData.organization)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(schemaData.localBusiness)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(schemaData.faq)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(schemaData.product)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(schemaData.service)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(schemaData.speakable)}
      </script>
    </>
  );
};
