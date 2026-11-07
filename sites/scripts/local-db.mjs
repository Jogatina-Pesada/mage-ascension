import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
// Development/test adapter for D1's documented prepare/bind/first/all/run/batch subset.
export function openDatabase(filename=':memory:') {
  const sqlite=new DatabaseSync(filename);sqlite.exec('PRAGMA foreign_keys=ON');
  sqlite.exec(readFileSync(new URL('../server/schema.sql',import.meta.url),'utf8'));
  const prepare=(sql,params=[])=>({
    bind(...values){return prepare(sql,values);},
    async first(){return sqlite.prepare(sql).get(...params)||null;},
    async all(){return {results:sqlite.prepare(sql).all(...params)};},
    async run(){const result=sqlite.prepare(sql).run(...params);return {meta:{changes:Number(result.changes)}};}
  });
  return {prepare,async batch(statements){sqlite.exec('BEGIN');try{const result=[];for(const statement of statements)result.push(await statement.run());sqlite.exec('COMMIT');return result;}catch(error){sqlite.exec('ROLLBACK');throw error;}},close(){sqlite.close();}};
}
