const Prize = require("../models/PrizesModel");
const Participant = require("../models/ParticipantsModel");
const Event = require("../models/EventModel");
const { catchAsync, sendSuccessResponseData } = require("../utils/helpers");
const APIFEATURES = require("../utils/apiFeatures");
const AppError = require("../utils/appError");

module.exports.getAllEvents = catchAsync(async (req, res) => {
  const apiFeatures = new APIFEATURES(Event, req.query)
    .filter()
    .sort()
    .paginate()
    .limitFields();

  const totalCount = Event.countDocuments();

  const events = await apiFeatures.query;

  sendSuccessResponseData(res, "events", events, totalCount);
});

module.exports.getAllEvents = catchAsync(async (req, res) => {
  const apiFeatures = new APIFEATURES(Event, req.query)
    .filter()
    .sort()
    .paginate()
    .limitFields();

  const totalCount = Event.countDocuments();

  const events = await apiFeatures.query;

  sendSuccessResponseData(res, "events", events, totalCount);
});
// get events
module.exports.getEvent = catchAsync(async (req, res) => {
  // check if the user owns the event
  const user = req.user;
  const event = await Event.findById(req.params.id).populate("creator");

  // check if the user owns the event
  //
  if (
    event.organisationId?.toString() !== user.organisationId?.toString() &&
    event.userId?.toString() !== user._id?.toString()
  ) {
    throw new AppError("You do not have permission to access this event.", 404);
  }

  if (!event) {
    throw new AppError("No event found with that ID.", 404);
  }

  sendSuccessResponseData(res, "event", event);
});

//create event
module.exports.createEvent = catchAsync(async (req, res) => {
  const { name } = req.body;

  // Check if the user is part of an organisation if yes, save the organisation id
  const organisationId = req.user.organisationId;

  console.log(organisationId);

  // if organisation save the organisation id, creator id,
  // if not organisation save with user id

  // Check if an event with the same name already exists for the user

  // Case-insensitive match
  const filter = organisationId
    ? { name: { $regex: new RegExp(`^${name}$`, "i") }, organisationId }
    : { name: { $regex: new RegExp(`^${name}$`, "i") }, userId: req.user.id };

  const existingEvent = await Event.findOne(filter);
  if (existingEvent) {
    throw new AppError("An event with this name already exists.", 400);
  }

  // Create the new event
  const newEvent = await Event.create({
    ...req.body,
    ...(organisationId
      ? { organisationId, creator: req.user.id }
      : { userId: req.user.id, creator: req.user.id }),
  });

  sendSuccessResponseData(res, "event", newEvent);
});

module.exports.updateEvent = catchAsync(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (
    event.organisationId?.toString() !== req.user.organisationId?.toString() &&
    event.userId?.toString() !== req.user._id?.toString()
  ) {
    throw new AppError("You do not have permission to access this event.", 404);
  }

  const { name } = req.body;
  const filter = event.organisationId
    ? { name, organisationId: event.organisationId }
    : { name, userId: event.userId };

  const existingEvent = await Event.findOne(filter);
  if (existingEvent && existingEvent._id.toString() !== event._id.toString()) {
    throw new AppError("An event with this name already exists.", 400);
  }

  if (!event) {
    throw new AppError("No event found with that ID.", 404);
  }

  if (event.status === "completed") {
    throw new AppError(`Cannot update a ${event.status} event.`, 400);
  }

  Object.keys(req.body).forEach((key) => {
    event[key] = req.body[key];
  });

  await event.save();
  sendSuccessResponseData(res, "event", event);
});

module.exports.deleteEvent = catchAsync(async (req, res) => {
  const { id } = req.params;

  const event = await Event.findById(id);

  if (
    event.organisationId?.toString() !== req.user.organisationId?.toString() &&
    event.userId?.toString() !== req.user._id?.toString()
  ) {
    throw new AppError("You do not have permission to access this event.", 404);
  }
  if (!event) {
    throw new AppError("No event found with that ID.", 404);
  }

  if (event.status === "active") {
    throw new AppError("You cannot delete an ongoing event.", 400);
  }

  await Promise.all([
    Prize.deleteMany({ eventId: id }),
    Participant.deleteMany({ eventId: id }),
  ]);

  await Event.findByIdAndDelete(id);

  sendSuccessResponseData(res, "event");
});

module.exports.getEventParticipants = catchAsync(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (
    event.organisationId?.toString() !== req.user.organisationId?.toString() &&
    event.userId?.toString() !== req.user._id?.toString()
  ) {
    throw new AppError("You do not have permission to access this event.", 404);
  }

  const apiFeatures = new APIFEATURES(
    Participant.find({ eventId: req.params.id }).populate("prize"),
    req.query
  )
    .filter()
    .sort()
    .paginate()
    .limitFields();

  const totalCount = await Participant.find({
    eventId: req.params.id,
  }).countDocuments();

  const participants = await apiFeatures.query;

  sendSuccessResponseData(res, "participants", participants, totalCount);
});

module.exports.getEventAllParticipants = catchAsync(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (
    event.organisationId?.toString() !== req.user.organisationId?.toString() &&
    event.userId?.toString() !== req.user._id?.toString()
  ) {
    throw new AppError("You do not have permission to access this event.", 404);
  }

  const participants = await Participant.find({ eventId: req.params.id });

  const totalCount = await Participant.find({
    eventId: req.params.id,
  }).countDocuments();

  sendSuccessResponseData(res, "participants", participants, totalCount);
});

module.exports.getEventPrizes = catchAsync(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (
    event.organisationId?.toString() !== req.user.organisationId?.toString() &&
    event.userId?.toString() !== req.user._id?.toString()
  ) {
    throw new AppError("You do not have permission to access this event.", 404);
  }
  const apiFeatures = new APIFEATURES(
    Prize.find({ eventId: req.params.id }),
    req.query
  )
    .filter()
    .sort()
    .paginate()
    .limitFields();

  const totalCount = await Prize.find({
    eventId: req.params.id,
  }).countDocuments();

  const prizes = await apiFeatures.query;

  sendSuccessResponseData(res, "prizes", prizes, totalCount);
});

module.exports.getAllEventPrizes = catchAsync(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (
    event.organisationId?.toString() !== req.user.organisationId?.toString() &&
    event.userId?.toString() !== req.user._id?.toString()
  ) {
    throw new AppError("You do not have permission to access this event.", 404);
  }

  const prizes = await Prize.find({ eventId: req.params.id });

  const totalCount = await Prize.find({
    eventId: req.params.id,
  }).countDocuments();

  sendSuccessResponseData(res, "prizes", prizes, totalCount);
});

module.exports.deleteEventParticipants = catchAsync(async (req, res) => {
  const { id: eventId } = req.params;

  if (!eventId) throw new AppError("You need to specify an event Id", 400);

  // Validate event existence
  const event = await Event.findById(eventId);
  if (!event) {
    throw new AppError("Event does not exist.", 404);
  }

  // Ensure event is inactive and emails have not been sent
  if (event.status !== "inactive") {
    throw new AppError(
      "Participants can only be deleted when the event is inactive.",
      400
    );
  }

  if (event.emailSent) {
    throw new AppError(
      "Participants cannot be deleted as the notification email has already been sent.",
      400
    );
  }

  // Delete the participants
  await Participant.deleteMany({ eventId });
  await Event.updateParticipantsCount(eventId);

  // Set the csv to free
  event.csvUploaded = false;

  await event.save();

  sendSuccessResponseData(res, "participants");
});
