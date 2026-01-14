import * as SQLite from 'expo-sqlite';
import mountainsJSON from '../../assets/mountains.json';

const db = SQLite.openDatabase('nusantara.db');

export function initLocalDb() {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS mountains (
          id TEXT PRIMARY KEY,
          slug TEXT,
          data TEXT
        )`
      );
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS users (
          email TEXT PRIMARY KEY,
          name TEXT,
          photo TEXT,
          premium INTEGER
        )`
      );
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS saved_routes (
          id TEXT PRIMARY KEY,
          mountain_id TEXT,
          name TEXT,
          coords TEXT
        )`
      );
      tx.executeSql('SELECT COUNT(*) as c FROM mountains', [], (_, { rows }) => {
        const count = rows.item(0).c;
        if (count === 0) {
          mountainsJSON.forEach(m => {
            tx.executeSql('INSERT INTO mountains (id, slug, data) VALUES (?, ?, ?)', [m.id, m.slug, JSON.stringify(m)]);
          });
        }
      });
    }, (err) => {
      console.error('init db tx error', err);
      reject(err);
    }, () => {
      resolve();
    });
  });
}

export function getAllMountainsLocal() {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql('SELECT data FROM mountains', [], (_, { rows }) => {
        const items = [];
        for (let i = 0; i < rows.length; i++) items.push(JSON.parse(rows.item(i).data));
        resolve(items);
      });
    }, reject);
  });
}

export function getMountainBySlugLocal(slug) {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql('SELECT data FROM mountains WHERE slug = ?', [slug], (_, { rows }) => {
        if (rows.length === 0) return resolve(null);
        resolve(JSON.parse(rows.item(0).data));
      });
    }, reject);
  });
}

export function saveUserLocal(user) {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql('INSERT OR REPLACE INTO users (email, name, photo, premium) VALUES (?, ?, ?, ?)', [
        user.email,
        user.name,
        user.photo || '',
        user.premium ? 1 : 0
      ]);
    }, reject, resolve);
  });
}

export function getUserLocal(email) {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM users WHERE email = ?', [email], (_, { rows }) => {
        if (rows.length === 0) return resolve(null);
        resolve(rows.item(0));
      });
    }, reject);
  });
}

export function saveRouteLocal(route) {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql('INSERT OR REPLACE INTO saved_routes (id, mountain_id, name, coords) VALUES (?, ?, ?, ?)', [
        route.id,
        route.mountain_id,
        route.name,
        JSON.stringify(route.coords)
      ]);
    }, reject, resolve);
  });
}
