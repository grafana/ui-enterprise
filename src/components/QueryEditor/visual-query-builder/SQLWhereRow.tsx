import React from 'react';
import { useAsync } from 'react-use';

import { type SelectableValue } from '@grafana/data';

import { type Config } from './AwesomeQueryBuilder';
import { WhereRow } from './WhereRow';
import { type QueryWithDefaults } from '../defaults';
import { type SQLQuery, type DB, type SQLExpression, type SQLSelectableValue } from '../types';
import { useSqlChange } from '../utils/useSqlChange';

interface WhereRowProps {
  query: QueryWithDefaults;
  fields: SelectableValue[];
  onQueryChange: (query: SQLQuery) => void;
  db: DB;
}

export function SQLWhereRow({ query, fields, onQueryChange, db }: WhereRowProps) {
  const state = useAsync(async () => {
    return mapFieldsToTypes(fields);
  }, [fields]);

  const { onSqlChange } = useSqlChange({ query, onQueryChange, db });

  return (
    <WhereRow
      // TODO: fix key that's used to force clean render or SQLWhereRow - otherwise it doesn't render operators correctly
      key={JSON.stringify(state.value)}
      config={{ fields: state.value || {} }}
      sql={query.sql!}
      onSqlChange={(val: SQLExpression) => {
        onSqlChange(val);
      }}
    />
  );
}

// needed for awesome query builder
function mapFieldsToTypes(columns: SQLSelectableValue[]) {
  const fields: Config['fields'] = {};
  for (const col of columns) {
    fields[col.value] = {
      type: col.raqbFieldType || 'text',
      valueSources: ['value'],
      mainWidgetProps: { customProps: { icon: col.icon } },
    };
  }
  return fields;
}
