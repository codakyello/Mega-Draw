const express = require("express");
const eventController = require("../controllers/eventController");
const { authenticate, authorize } = require("../controllers/authController");
const router = express.Router();

router
  .route("/")
  .get(authenticate, authorize("admin"), eventController.getAllEvents)
  .post(authenticate, authorize("user"), eventController.createEvent);

router
  .route("/:id")
  .get(authenticate, authorize("user", "admin"), eventController.getEvent)
  .patch(authenticate, authorize("user", "admin"), eventController.updateEvent)
  .delete(
    authenticate,
    authorize("user", "admin"),
    eventController.deleteEvent
  );

// get all event participants
router
  .route("/:id/participants")
  .get(
    authenticate,
    authorize("user", "admin"),
    eventController.getEventParticipants
  )
  .delete(
    authenticate,
    authorize("user", "admin"),
    eventController.deleteEventParticipants
  );

router
  .route("/:id/all-participants")
  .get(
    authenticate,
    authorize("user", "admin"),
    eventController.getEventAllParticipants
  );
// get all event prizes
router
  .route("/:id/prizes")
  .get(
    authenticate,
    authorize("user", "admin"),
    eventController.getEventPrizes
  );

router
  .route("/:id/all-prizes")
  .get(
    authenticate,
    authorize("user", "admin"),
    eventController.getAllEventPrizes
  );
module.exports = router;
