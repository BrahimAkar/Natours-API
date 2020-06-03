const fs = require("fs");

const tours = JSON.parse(fs.readFileSync(`./dev-data/data/tours-simple.json`));

const getAllTours = (req, res) => {
  res.status(200).json({
    success: true,
    data: tours,
  });
};

const getTour = (req, res) => {
  const id = req.params.id * 1;
  const item = tours.find((el) => el.id === id);
  item ? res.send(item) : res.send({ success: false });
};

const createTour = (req, res) => {
  const id = tours[tours.length - 1].id + 1;
  const newArray = Object.assign({ id: id }, req.body);
  tours.push(newArray);
  console.log(tours);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (error) => {}
  );
  // console.log(newArray);
  res.send({
    success: true,
    data: req.body,
  });
};

const updateTour = (req, res) => {
  const id = req.params.id * 1;
  const item = tours.find((el) => el.id === id);
  item
    ? res.send({
        success: true,
        message: "time updated successfully",
        data: item,
      })
    : res.send({ success: false, message: "we can't find this item" });
};
const deleteTour = (req, res) => {
  const id = req.params.id * 1;
  const item = tours.find((el) => el.id === id);
  item
    ? res.send({
        success: true,
        message: "item deleted successfully",
      })
    : res.send({ success: false, message: "we can't find this item" });
};

module.exports = { getAllTours, getTour, createTour, updateTour, deleteTour };
