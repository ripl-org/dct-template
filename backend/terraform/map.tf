resource "aws_location_map" "website_map" {
  # https://docs.aws.amazon.com/location/latest/APIReference/API_MapConfiguration.html
  configuration {
    style = "VectorOpenDataStandardLight"
  }

  map_name = "${local.platform}-website-map"
}
