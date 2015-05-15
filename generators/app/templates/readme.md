### Curls

```
curl -X POST -H 'Content-Type:application/json' -d '[{"id":"foo/bar","status":"fail"},{"id":"foo/baz","status":"pass"}]' localhost:3001/checks
curl -X POST -H 'Content-Type:application/json' -d '{"status":"warn"}' localhost:3001/checks/foo/qux
curl -X POST -H 'Content-Type:application/json' -d '{"value":"watch out!"}' localhost:3001/checks/foo/qux
```
