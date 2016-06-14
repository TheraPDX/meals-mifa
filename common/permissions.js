Routes.allow({
  insert() { return false; },
  update() { return false; },
  remove() { return false; }
});

Routes.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; }
});


Clients.allow({
  insert() { return false; },
  update() { return false; },
  remove() { return false; }
});

Clients.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; }
});

Meteor.users.allow({
  insert() { return true; },
  update() { return true; },
  remove() { return true; }
});

Meteor.users.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; }
});
