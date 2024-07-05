import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
	title: String,
	startTime: Date,
	endTime: Date,
	status: String,
});

const Job = mongoose.model("Job", jobSchema);

export default Job;
