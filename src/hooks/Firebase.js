import { GetMembers2 } from '@/lib/Utils';
// import { Invite } from '@/helpers/sendInBlue/SendInBlue';
import { app, auth, db, analytics } from '@/config/firebase/Firebase';




// MARK: -------  Auth
export function GetUserInfo(uid, email, callback) {
  var docRef = null

  if (uid) {
    docRef = firestore.collection("users").where("authUID", "==", uid)
  } else if (email) {
    docRef = firestore.collection("users").where("email", "==", email)
  }

  docRef.get()
  .then((querySnapshot) => {
    if (querySnapshot.size > 0) {
      callback(querySnapshot.docs[0])
    } else {
      callback(null)
    }
  })
  .catch((error) => {
      callback(null)
  });
}


export function GetUserDocInfo(uid, callback) {
  if (uid) {
    var docRef = firestore.collection("users").doc(uid);
    docRef.get().then((doc) => {
      if (doc.exists) {
        callback(doc)
      } else {
        callback(null)
      }
    }).catch((error) => {
      callback(null)
    });
  } else {
    callback(null)
  }
}


export function ResetPass(email, callback) {
  auth.sendPasswordResetEmail(email)
  .then(() => {
    callback(true, null)
  })
  .catch((error) => {
    var errorCode = error.code;
    callback(false, errorCode)
  });
}


// MARK: -------  Stripe
export function UpdateUserOnlineStatus(userUID, callback) {
  firestore.collection("users").doc(userUID).update({ lastActiveAt: firebase.firestore.Timestamp.fromDate(new Date()) })
  // if (userUID) {
  //   firestore.collection("users").doc(userUID)
  //   .update({ isOnline: isOnline })
  //   .then(() => {
  //     callback(true, null)
  //   })
  //   .catch((error) => {
  //     callback(false, error)
  //   });
  // } else {
  //   callback(false, null)
  // }
}


// MARK: -------  Invite
export function InviteMember(currentUserUID, email, inviteType, boardUID, callback) {
  if (boardUID) {
    var docRef = firestore.collection("organizations").doc(boardUID);
    docRef.get().then((doc) => {
      if (doc.exists) {
        const data = doc.data()
        const { admins, members, drivers, pendingMembersEmails } = data

        // Check if user already added
        if (pendingMembersEmails.includes(email)) {
          callback()
        } else {
          // not added yet
          GetUserInfo(null, email, function(userInfo, error) {
            const user = userInfo

            if (user) {
              if (admins.includes(user.id) || members.includes(user.id) || (drivers && drivers.includes(user.id))) {
                // Already a member
                callback()
              } else {
                SavePendingInvite(currentUserUID, boardUID, email, inviteType, function() {
                  GetUserDocInfo(currentUserUID, function(currentUserInfo) {
                    const currentUserData = currentUserInfo
                    const fullName = currentUserData['fName'] + ' ' + currentUserData['lName']
  
                    GetBoardInfo(boardUID, function(currentBoardInfo) {
                      const currentBoardData = currentBoardInfo.data()
                      const boardTitle = currentBoardData['title']
                      // Invite(email, fullName, boardTitle, '')
                      callback()
                    })
                  })
                })
              }
            } else {
              // not a zenpath user
              SavePendingInvite(currentUserUID, boardUID, email, inviteType, function() {
                GetUserDocInfo(currentUserUID, function(currentUserInfo) {
                  const currentUserData = currentUserInfo
                  const fullName = currentUserData['fName'] + ' ' + currentUserData['lName']
  
                  GetBoardInfo(boardUID, function(currentBoardInfo) {
                    const currentBoardData = currentBoardInfo.data()
                    const boardTitle = currentBoardData['title']
                    // Invite(email, fullName, boardTitle, '')
                    callback()
                  })
                })
              })
            }
          })
        }
      } else {
        callback()
      }
    }).catch((error) => {
      callback()
    });
  } else {
    callback()
  }
}


function SavePendingInvite(senderUID, boardUID, email, inviteType, callback) {
  var docRef = firestore.collection("organizations").doc(boardUID);
  const invite = { email: email, type: inviteType }

  docRef.update({
    pendingInvites: firebase.firestore.FieldValue.arrayUnion(invite)
  }).then(function() {

    SaveNewNotification(boardUID, email, senderUID, 'invite', function() {
      // work here
      callback()
    })
  });
}


export function RemoveMemberInvite(boardUID, userUID, email, callback) {

  RemovePendingInviteNotification(boardUID, email, function() {

    GetInviteInfo(boardUID, userUID, email, function(inviteInfo) {

      if (inviteInfo) {
        var docRef = firestore.collection("organizations").doc(boardUID);
        docRef.update( inviteInfo ).then(function() {
          GetEmployeeInfoFromAssignedMember(boardUID, userUID, function(employee) {
            if (employee) {
              const employeeUID = employee.id
              UnAssignActiveMember(employeeUID, function() {
                callback()
              })
            } else {
              callback()
            }
          })
          // callback()
        });
      } else {
        callback()
      }
    })
  })
}


function GetEmployeeInfoFromAssignedMember(boardUID, userUID, callback) {
  const docRef = firestore.collection("employees").where("orgUID", "==", boardUID).where("userUID", "==", userUID)

  docRef.get()
  .then((querySnapshot) => {

    if (querySnapshot.size > 0) {
      const employee = querySnapshot.docs[0];
      callback(employee)
    } else {
      callback(null)
    }
  })
  .catch((error) => {
    callback(null)
  });
}


function GetInviteInfo(boardUID, userUID, email, callback) {
  var docRef = firestore.collection("organizations").doc(boardUID);
  let inviteInfo = null

  docRef.get().then((doc) => {
    if (doc.exists) {
      const { admins, members, drivers, pendingInvites } = doc.data()

      if (userUID) {
        inviteInfo = admins.includes(userUID) && admins.length >= 2 ? { admins: firebase.firestore.FieldValue.arrayRemove(userUID) } : members.includes(userUID) ? { members: firebase.firestore.FieldValue.arrayRemove(userUID) } : drivers && drivers.includes(userUID) ? { drivers: firebase.firestore.FieldValue.arrayRemove(userUID) } : null
      } else if (email) {
        if (pendingInvites && pendingInvites.length > 0) {
          for (let i = 0; i < pendingInvites.length; i++) {
            const pendingInvite = pendingInvites[i]
  
            if (pendingInvite['email'] === email) {
              inviteInfo = { pendingInvites: firebase.firestore.FieldValue.arrayRemove(pendingInvite) }
            } 
          }
        }
      }
    }

    callback(inviteInfo)
  }).catch((error) => {
    callback(inviteInfo)
  });
}


function RemovePendingInviteNotification(boardUID, email, callback) {
  const docRef = firestore.collection("notifications").where("boardUID", "==", boardUID).where("type", "==", 'invite').where("recipEmail", "==", email)

  docRef.get()
  .then((querySnapshot) => {

    if (querySnapshot.size > 0) {
      const notification = querySnapshot.docs[0];
      notification.ref.update({ isPublic: false });
      callback()
    } else {
      callback()
    }
  })
  .catch((error) => {
      callback()
  });
}


export function SavePendingInviteResponse(notificationUID, userInfo, boardUID, isInviteApproved, callback) {
  const userUID = userInfo.id
  const { email, fName, lName } = userInfo

  MarkReadNotification(notificationUID, function(success) {
    if (success) {
      GetPendingInviteInfo(boardUID, email.toLowerCase(), function(pendingInvite) {
        if (pendingInvite) {
          const inviteType = pendingInvite['type'] === 'admin' ? 'admins' : pendingInvite['type'] === 'member' ? 'members' : 'drivers' 
          
          const invite = { [inviteType]: firebase.firestore.FieldValue.arrayUnion(userUID) }

          var docRef = firestore.collection("organizations").doc(boardUID);

          if (isInviteApproved) {
            docRef.update(invite).then(function() {
              GetEmployeeInfo(boardUID, userUID, function(employeeInfo) {
                if (employeeInfo) {
                  RemoveMemberInvite(boardUID, null, email.toLowerCase(), function() {
                    callback()
                  })
                } else {
                  SaveNewEmployee(null, boardUID, fName, lName, '', '', '', '', userUID, function() {
                    
                    // Remove from pending...
                    RemoveMemberInvite(boardUID, null, email.toLowerCase(), function() {
                      callback()
                    })
                  })
                }
              })
            });
          } else {
            // Remove from pending...
            RemoveMemberInvite(boardUID, null, email.toLowerCase(), function() {
              callback()
            })
          }
        } else {
          console.log('cant find pend');
        }
      })
    } else {
      callback()
    }
  })
}


function GetPendingInviteInfo(boardUID, email, callback) {
  var docRef = firestore.collection("organizations").doc(boardUID);

  docRef.get().then((doc) => {
    if (doc.exists) {
      const pendingInvites = doc.data()['pendingInvites']

      if (pendingInvites && pendingInvites.length > 0) {
        for (let i = 0; i < pendingInvites.length; i++) {
          const pendingInvite = pendingInvites[i]

          if (pendingInvite['email'] === email) {
            callback(pendingInvite)
          } else {
            if (pendingInvite['email'] === pendingInvites[pendingInvites.length - 1]['email']) {
              callback(null)
            }
          }
        }
      } else {
        callback(null)
      }
    } else {
      callback(null)
    }
  }).catch((error) => {
    callback(null)
  });
}


export function AssignActiveMember(employeeUID, assignedUserUID, callback) {

  firestore.collection("employees").doc(employeeUID)
  .update({ userUID: assignedUserUID })
  .then((doc) => {
    callback()
  }).catch((error) => {
    callback()
  });
}


export function UnAssignActiveMember(employeeUID, callback) {

  firestore.collection("employees").doc(employeeUID)
  .update({ userUID: '' })
  .then((doc) => {
    callback()
  }).catch((error) => {
    callback()
  });
}


// MARK: -------  Company
export function GetBoardInfo(uid, callback) {
  if (uid) {
    var docRef = firestore.collection("organizations").doc(uid);
    docRef.get().then((doc) => {
      if (doc.exists) {
        callback(doc)
      } else {
        callback(null)
      }
    }).catch((error) => {
      callback(null)
    });
  } else {
    callback(null)
  }
}


export function DeleteBoard(boardUID, callback) {

  if (boardUID !== null) {
    firestore.collection("organizations").doc(boardUID).get()
    .then((doc) => {
        if (doc.exists) {
          const newBoard= {
            boardUID: doc.id,
            ...doc.data(),
            createdAt: new Date()
          }

                firestore.collection("recentlyDeleted").add(newBoard)
                .then((docRef) => {
                  // Delete from organization

                  firestore.collection("organizations").doc(boardUID).delete().then(() => {
                    callback(true, null)
                  }).catch((error) => {
                    callback(false, null)
                  });
                })
                .catch((error) => {
                  callback(false, null)
                });
        } else {
          callback(false, null)
        }
    }).catch((error) => {
      callback(false, error)
    });
  } else {
    callback(false, null)
  }
}


export function UpdateBoardSubscriptionInfo(orgUID, subscriptionId, isLive, callback) {
  if (orgUID) {
    let subscriptionInfo = null
    
    if (isLive) {
      subscriptionInfo = { subscriptionUID: subscriptionId }
    } else {
      subscriptionInfo = { testSubscriptionUID: subscriptionId }
    }

    firestore.collection("organizations").doc(orgUID)
    .update(subscriptionInfo)
    .then(() => {
      callback(true, null)
    })
    .catch((error) => {
      callback(false, error)
    });
  } else {
    callback(false, null)
  }
}


export function GetBoardMembers(userUID, callback) {
  firestore.collection("organizations").where("members", "array-contains", userUID).orderBy("createdAt", "desc")
    .get()
    .then((snapshot) => {
      const newCompanies = snapshot.docs.map((doc) => ({
        id: doc.id,
        lastDoc: snapshot.docs[snapshot.docs.length - 1],
        ...doc.data(),
        members: GetMembers2(doc.data().admins, doc.data().members, doc.data().pendingMembersEmails)
      }))

      //
      GetBoardDrivers(userUID, function(companies) {
        const updatedCompanines = [...companies, ...newCompanies]
        const unique = [...new Map(updatedCompanines.map((item, key) => [item[key], item])).values()]
        callback(unique)
      })
      //

      // callback(newCompanies)
    })
    .catch((error) => {
      callback([])
    });
}


function GetBoardDrivers(userUID, callback) {
  firestore.collection("organizations").where("drivers", "array-contains", userUID).orderBy("createdAt", "desc")
    .get()
    .then((snapshot) => {
      const newCompanies = snapshot.docs.map((doc) => ({
        id: doc.id,
        lastDoc: snapshot.docs[snapshot.docs.length - 1],
        ...doc.data(),
        members: GetMembers2(doc.data().admins, doc.data().members, doc.data().pendingMembersEmails)
      }))

      callback(newCompanies)
    })
    .catch((error) => {
      callback([])
    });
}


// MARK: -------  Notifications
export function SaveNewNotification(boardUID, recipEmail, senderUID, type, callback) {
  firestore.collection("notifications").add({
    boardUID: boardUID,
    recipEmail: recipEmail,
    senderUID: senderUID,
    type: type,
    isResponded: false,
    isRead: false,
    isPublic: true,
    createdAt: new Date()
  })
  .then((user) => {
    callback()
  })
  .catch((error) => {
    callback()
  });
}


export function MarkReadNotification(notificationUID, callback) {
  firestore.collection("notifications").doc(notificationUID).update({
    isRead: true,
    isResponded: true
  })
  .then((docRef) => {
    callback(true)
  })
  .catch((error) => {
    callback(false)
  });
}


// MARK: -------  Activity
export function SaveActivity(type, data, userUID, tableUID, desc) {
  GetActivity(type, userUID, tableUID, data, function(activity) {
    let activityInfo = null
    let updatedData = null

    if (activity) {

      if (type === 'viewedWalkThroughDemo') {
        const lastWatchedIndex = activity.info['value']
        const updatedIndex = lastWatchedIndex < data ? data : lastWatchedIndex
        updatedData = updatedIndex
        activityInfo = { value: updatedData }
      } else if (type === 'changedTripStatus') {
        updatedData = data
        if (desc) {
          activityInfo = { value: updatedData, desc: desc }
        } else {
          activityInfo = { value: updatedData }
        }
      }

      firestore.collection("activity").doc(activity.id).update({
        info: activityInfo,
        lastModifiedAt: new Date()
      })
      .then((docRef) => {
        // console.log('DDDDDD: ', docRef, activity.id);
      })
      .catch((error) => {
        console.log('EEEEE: ');
      });
    } else {
      // save new
      let item = null
      
      if (type === 'viewedWalkThroughDemo') {
        item = { userUID: userUID, type: type, info: { value: data }, createdAt: new Date(), lastModifiedAt: new Date() }
      } else if (type === 'changedTripStatus') {
        updatedData = data

        if (desc) {
          activityInfo = { value: updatedData, desc: desc }
        } else {
          activityInfo = { value: updatedData }
        }
        item = { userUID: userUID, tripUID: tableUID, type: type, info: activityInfo, createdAt: new Date(), lastModifiedAt: new Date() }
      }
      
      firestore.collection("activity").add(item)
      .then((docRef) => {
        
      })
      .catch((error) => {
        console.log('NAHHHHH: ');
      });
    }
  })
}


export function GetActivity(type, userUID, tableUID, data, callback) {
  let query = null

  if (type === 'viewedWalkThroughDemo') {
    query = firestore.collection("activity").where("userUID", "==", userUID).where("type", "==", type)
  } else if (type === 'changedTripStatus') {
    query = firestore.collection("activity").where("userUID", "==", userUID).where("tripUID", "==", tableUID).where("type", "==", type).where("info", "==", { 'value': data })
  }

  query.get()
    .then((snapshot) => {
      const doc = snapshot.docs[0]

      const activity = {
        id: doc.id,
        ...doc.data()
      }
     
      callback(activity)
    })
    .catch((error) => {
      callback(null)
    });
}


// MARK: -------  Employees
export function GetEmployeeInfo(boardUID, userUID, callback) {

  if (boardUID && userUID) {
    var docRef = firestore.collection("employees").where("orgUID", "==", boardUID).where("userUID", "==", userUID)
  
    docRef.get()
    .then((querySnapshot) => {
      if (querySnapshot.size > 0) {
        callback(querySnapshot.docs[0])
      } else {
        callback(null)
      }
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
        callback(null)
    });
  } else {
    callback(null)
  }
}


export async function GetClientsDocInfo2(uid, callback) {

  var docRef = firestore.collection("clients").doc(uid);
  docRef.get().then((doc) => {
    if (doc.exists) {
      const user = {
        id: doc.id,
        ...doc.data()
      }

      callback(user)
    } else {
      callback(null)
    }
  }).catch((error) => {
    callback(null)
  });
}


export function DeleteEmployee(employeeUID, callback) {

  if (employeeUID !== null) {
    firestore.collection("employees").doc(employeeUID).get()
    .then((doc) => {
        if (doc.exists) {
          const newEmployee = {
            employeeUID: doc.id,
            ...doc.data(),
            createdAt: new Date()
          }

                firestore.collection("recentlyDeleted").add(newEmployee)
                .then((docRef) => {
                  // Delete from employees

                  firestore.collection("employees").doc(employeeUID).delete().then(() => {
                    callback(true, null)
                  }).catch((error) => {
                    callback(false, null)
                  });
                })
                .catch((error) => {
                  callback(false, null)
                });
        } else {
          callback(false, null)
        }
    }).catch((error) => {
      callback(false, error)
    });
  } else {
    callback(false, null)
  }
}


export function UpdateEmployee(employeeUID, headerUID, item, callback) {
  firestore.collection("employees").doc(employeeUID).update({
    [headerUID]: item
  })
  .then((docRef) => {
      callback(null)
  })
  .catch((error) => {
      callback(error)
  });
}


// MARK: -------  Clients
export function GetClient(clientUID, callback) {
  // let clients = []
  // const batchLimit = 10;

  // for (let i = 0; i < clientsUIDs.length; i += batchLimit) {
  //   const clientBatch = clientsUIDs.slice(i, i + batchLimit);

  //   firestore.collection("clients").where("ownerUID", "==", boardUID).where(firebase.firestore.FieldPath.documentId(), 'in', clientBatch).get()
  //   .then((snapshot) => {
  //     const newClients = snapshot.docs.map((doc) => ({
  //       id: doc.id,
  //       lastDoc: snapshot.docs[snapshot.docs.length - 1],
  //       ...doc.data()
  //     }))
  
  //     clients.push(...newClients)
  //     if (clientBatch[clientBatch.length - 1] === clientsUIDs[clientsUIDs.length - 1]) {
  //       callback(clients)
  //     }
  //   })
  //   .catch((error) => { 
  //     if (clientBatch[clientBatch.length - 1] === clientsUIDs[clientsUIDs.length - 1]) {
  //       callback(clients)
  //     }
  //   });
  // }
}


export function DeleteClient(clientUID, callback) {

  if (clientUID !== null) {
    firestore.collection("clients").doc(clientUID).get()
    .then((doc) => {
        if (doc.exists) {
          const newClient = {
            clientUID: doc.id,
            ...doc.data(),
            createdAt: new Date()
          }

                firestore.collection("recentlyDeleted").add(newClient)
                .then((docRef) => {
                  // Delete from clients

                  firestore.collection("clients").doc(clientUID).delete().then(() => {
                    callback(true, null)
                  }).catch((error) => {
                    callback(false, null)
                  });
                })
                .catch((error) => {
                  callback(false, null)
                });
        } else {
          callback(false, null)
        }
    }).catch((error) => {
      callback(false, error)
    });
  } else {
    callback(false, null)
  }
}

export function UpdateClient(clientUID, headerUID, item, callback) {
  firestore.collection("clients").doc(clientUID).update({
    [headerUID]: item
  })
  .then((docRef) => {
      callback(null)
  })
  .catch((error) => {
      callback(error)
  });
}


// MARK: -------  Trips
export function SaveImportedTrips(orgUID, importFields, callback) {
  var importItems = importFields
  var batch = firestore.batch();
  var tripBatch = firestore.batch();


  importItems.forEach((importItem) => {
    var importUser = {}

    if (importItem['fName'] && importItem['lName']) {
      importUser['fName'] = importItem['fName']
      importUser['lName'] = importItem['lName']
      importUser['ownerUID'] = orgUID
      importUser['createdAt'] = firebase.firestore.Timestamp.fromDate(new Date())
    }

    batch.set(firestore.collection('clients').doc(), importUser);
  })

  batch.commit().then(function () {
  
    GetImportedClients(orgUID, importItems, function(savedClients, error) {

      if (savedClients) {
        importItems.forEach((importItem) => {

          for (let i = 0; i < savedClients.length; i++) {
            const savedClient = savedClients[i]
  
            if (importItem['fName'] === savedClient['fName'] && importItem['lName'] === savedClient['lName']) {
              importItem['71130'] = savedClient.id
              break;
            }
          }
        })
  
        // Trips
        importItems.forEach((importItem) => {
          var importTrip = {}

          if (importItem['71130'] && importItem['16538']) {
            importTrip = importItem
            importTrip['orgUID'] = orgUID
            importItem['16538'] = firebase.firestore.Timestamp.fromDate(importItem['16538'])
            importTrip['createdAt'] = firebase.firestore.Timestamp.fromDate(new Date())
  
            if (importTrip['fName']) {
              delete importTrip['fName'];
            }
  
            if (importTrip['lName']) {
              delete importTrip['lName'];
            }
  
            tripBatch.set(firestore.collection('trips').doc(), importTrip);
          }
  

        })

        tripBatch.commit().then(function () {
          GetImportedTrips(orgUID, importItems, function(allHere) {

            callback()
          })

          // callback()
        })
      } else {
        callback()
      }
    })
  });
}

function GetImportedClients(orgUID, importItems, callback) {
  const clientsLastNames = []

  importItems.forEach((importItem) => {

    if (importItem['lName']) {
      clientsLastNames.push(importItem['lName'])
    }
  })

  // Query last names & orgUID
  firestore.collection("clients").where("ownerUID", "==", orgUID).where("lName", "in", clientsLastNames).get()
  .then((snapshot) => {
    const newClients = snapshot.docs.map((doc) => ({
      id: doc.id,
      lastDoc: snapshot.docs[snapshot.docs.length - 1],
      ...doc.data()
    }))

    callback(newClients, null)
  })
  .catch((error) => { 

    callback(null, error)
  });
}

function GetImportedTrips(orgUID, importItems, callback) {
  // const clientsLastNames = []

  // importItems.forEach((importItem) => {

  //   if (importItem['lName']) {
  //     clientsLastNames.push(importItem['lName'])
  //   }
  // })

  // Query last names & orgUID
  firestore.collection("trips").where("orgUID", "==", orgUID).get()
  .then((snapshot) => {
    const newTrips = snapshot.docs.map((doc) => ({
      id: doc.id,
      lastDoc: snapshot.docs[snapshot.docs.length - 1],
      ...doc.data()
    }))

    callback(newTrips, null)
  })
  .catch((error) => { 

    callback(null, error)
  });
}

export function GetTripsSinceDate(orgUID, callback) {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);

  firestore.collection("trips").where("orgUID", "==", orgUID).where("createdAt", ">=", firstDay).get()
  .then((snapshot) => {
    const newTrips = snapshot.docs.map((doc) => ({
      id: doc.id,
      lastDoc: snapshot.docs[snapshot.docs.length - 1],
      ...doc.data()
    }))

    callback(newTrips, null)
  })
  .catch((error) => { 
    callback(null, error)
  });
}


// MARK: -------  Table Settings
export function AddTableHeader(headerUID, headerTitle, headerIsHidden, companySettings, callback) { // fixed
  const tableSettingsUID = companySettings.id
  const headers = companySettings.headers
  const newHeader = { uid: headerUID, title: headerTitle, indexPosition: 7, type: 'text', isHidden: headerIsHidden }

  firestore.collection("tableSettings").doc(tableSettingsUID)
  .update({ headers: headers })
  .then((doc) => {
    callback()
  }).catch((error) => {
    callback()
  });
}


export function UpdateTableHeaderOptions(headers, companySettings, callback) {
  const tableSettingsUID = companySettings.id

  firestore.collection("tableSettings").doc(tableSettingsUID)
  .update({ headers: headers })
  .then((doc) => {
    callback()
  }).catch((error) => {
    callback()
  });
}


// MARK: -------  Recently Deleted
function GetRecentlyDeleted(type, docUIDs, callback) {
  let items = []
  const batchLimit = 10;

  for (let i = 0; i < docUIDs.length; i += batchLimit) {
    const docBatch = docUIDs.slice(i, i + batchLimit).filter(function(el) { return el; });

    if (type === 'clients') {
      firestore.collection("recentlyDeleted").where("clientUID", "in", docBatch).get()
      .then((snapshot) => {
        const deletedClients = snapshot.docs.map((doc) => ({
          id: doc.data()['clientUID'],
          lastDoc: snapshot.docs[snapshot.docs.length - 1],
          ...doc.data()
        }))
    
        items.push(...deletedClients)
        if (docBatch[docBatch.length - 1] === docUIDs[docUIDs.length - 1]) {
          callback(items)
        }
      })
      .catch((error) => { 
        if (docBatch[docBatch.length - 1] === docUIDs[docUIDs.length - 1]) {  
          callback(items)
        }
      });
    } else {
      callback(items)
    }
  }
}


export function SaveNewEmployee(employeeUID, orgUID, employee_fName, employee_lName, employee_phone, employee_position, employee_dateHired, employee_comments, userUID, callback) {
  var employeeUpdated_DOB = null
  var employeeUpdated_Phone = null

  if (employee_dateHired === null || employee_dateHired === "") {
    employeeUpdated_DOB = firebase.firestore.Timestamp.fromDate(new Date());
  } else {
    employeeUpdated_DOB = employee_dateHired
  }

  if (employee_phone !== null || employee_phone !== "") {
    employeeUpdated_Phone = employee_phone.replace(/[^a-zA-Z0-9]/g, '')
  }

  if (employeeUID === null) {
    firestore.collection("employees").add({
      orgUID: orgUID,
      fName: employee_fName.toLowerCase(),
      lName: employee_lName.toLowerCase(),
      phone: employeeUpdated_Phone ? employeeUpdated_Phone : '',
      position: employee_position ? employee_position: '',
      dateHired: employeeUpdated_DOB,
      comments: employee_comments ? employee_comments : '',
      userUID: userUID ? userUID : '',
      createdAt: firebase.firestore.Timestamp.fromDate(new Date())
    })
    .then((docRef) => {
        callback(true, null)
    })
    .catch((error) => {
        callback(false, error)
    });
  } else {
    firestore.collection("employees").doc(employeeUID).update({
      orgUID: orgUID,
      fName: employee_fName.toLowerCase(),
      lName: employee_lName.toLowerCase(),
      phone: employeeUpdated_Phone,
      position: employee_position,
      dateHired: employeeUpdated_DOB,
      comments: employee_comments
    })
    .then((docRef) => {
        callback(true, null)
    })
    .catch((error) => {
        callback(false, error)
    });
  }
}


export function DeleteTrip(tripUID, callback) {

  if (tripUID !== null) {
    firestore.collection("trips").doc(tripUID).delete().then(() => {
      callback(true, null)
    }).catch((error) => {
      callback(false, error)
    });
  }
}

export function SaveHelpInfo(email, fName, lName, jobTitle, phone, compName, compSize, message, callback) {
  firestore.collection("help").add({
    email: email,
    fName: fName.toLowerCase(),
    lName: lName.toLowerCase(),
    jobTitle: jobTitle ? jobTitle.toLowerCase() : '',
    phone: phone,
    compName: compName.toLowerCase(),
    compSize: compSize,
    message: message,
    createdAt: firebase.firestore.Timestamp.fromDate(new Date())
  })
  .then((docRef) => {
    callback()
  })
  .catch((error) => {
    callback()
  });
}

export function SaveTagsAndIndex(boardUID, itemUID, category, item, callback) {
  var tags = [];

  if (category === 'clients') {
    const fName = item['fName'] ? item['fName'].toLowerCase().split(" ") : []
    const lName = item['lName'] ? item['lName'].toLowerCase().split(" ") : []
    const fullName = item['fullName'] ? item['fullName'].toLowerCase() : ''
    let subTags = [...fName, ...lName]
    // subTags.push(fullName)

    // first name
    fName.forEach(function(tag){
      for (let i = 1; i < tag.length + 1; i++) {
        if (!tags.includes(tag)) tags.push(tag.substring(0, i));
      }
    })

    // last name
    lName.forEach(function(tag){
      for (let i = 1; i < tag.length + 1; i++) {
        if (!tags.includes(tag)) tags.push(tag.substring(0, i));
      }
    })

    // full name
    for (let i = 1; i < fullName.length + 1; i++) {
      const nam = fullName.substring(0, i)
      if (!tags.includes(nam)) tags.push(nam);
    }
    
    subTags.forEach(function(tag){
      for (let i = 1; i < tag.length + 1; i++) {
        if (!tags.includes(tag)) tags.push(tag.substring(0, i));
      }
    })
  }


  GetTaggedIndexItem(itemUID, function(taggedItem, error) {
    if (taggedItem) {
      firestore.collection("taggedIndex").doc(taggedItem.id).update({
        lastUpdatedAt: firebase.firestore.Timestamp.fromDate(new Date()),
        tags: tags,
      })
      .then((docRef) => {
          callback(true, null)
      })
      .catch((error) => {
          callback(false, error)
      });
    } else {    
      firestore.collection("taggedIndex").add({
        boardUID: boardUID,
        category: category,
        itemUID: itemUID,
        tags: tags,
        createdAt: firebase.firestore.Timestamp.fromDate(new Date())
      })
      .then((docRef) => {
        callback(true, null)
      })
      .catch((error) => {
        callback(false, error)
      });
    }
  })
}

function GetTaggedIndexItem(itemUID, callback) {
  
  if (itemUID) {
    var docRef = firestore.collection("taggedIndex").where('itemUID', '==', itemUID).get()
    docRef.then((snapshot) => {
      const item = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }))

      callback(item[0], null)
    })
    .catch((error) => { 
      callback(null, error)
    });
  } else {
    callback(null, null)
  }
}

export function SearchItems(boardUID, category, value, callback) {
  var docRef = firestore.collection("taggedIndex").where('boardUID', '==', boardUID).where('category', '==', category).where('tags', 'array-contains', value).limit(5).get()
  docRef.then((snapshot) => {
    const items = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }))

    let itemUIDs = []
    for (let i = 0; i < items.length; i++) {
        const itemUID = items[i]['itemUID']

        if (itemUID) {
          itemUIDs.push(itemUID)
        }
    }

    if (itemUIDs.length > 0) {
      GetClientsDocInfo(itemUIDs, function(newItems) {
        callback(newItems, null)
      })
    } else {
      callback([], null)
    }
  })
  .catch((error) => { 
    callback(null, error)
  });
}

export function GetClientsDocInfo(uids, callback) {
  let users = []
  const batchLimit = 5;

  for (let i = 0; i < uids.length; i += batchLimit) {
    const uidBatch = uids.slice(i, i + batchLimit).filter(function(el) { return el; });

    firestore.collection("clients").where(firebase.firestore.FieldPath.documentId(), 'in', uidBatch).get()
    .then((snapshot) => {
      const newUser = snapshot.docs.map((doc) => ({
        id: doc.id,
        lastDoc: snapshot.docs[snapshot.docs.length - 1],
        ...doc.data()
      }))

      users.push(...newUser)

      if (uidBatch[uidBatch.length - 1] === uids[uids.length - 1]) {
        callback(users)
      }
    })
    .catch((error) => { 
      if (uidBatch[uidBatch.length - 1] === uids[uids.length - 1]) {
        callback(users)
      }
    });
  }
}


export function DeleteUser(callback) {
  const user = auth.currentUser;

  user.delete().then(() => {
    callback()
  }).catch((error) => {
    callback()
  });
}