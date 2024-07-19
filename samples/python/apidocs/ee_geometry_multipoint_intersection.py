# Copyright 2023 The Google Earth Engine Community Authors
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# [START earthengine__apidocs__ee_geometry_multipoint_intersection]
# Define a MultiPoint object.
multipoint = ee.Geometry.MultiPoint([[-122.082, 37.420], [-122.081, 37.426]])

# Define other inputs.
input_geom = ee.Geometry.BBox(-122.085, 37.415, -122.075, 37.425)

# Apply the intersection method to the MultiPoint object.
multipoint_intersection = multipoint.intersection(right=input_geom, maxError=1)

# Print the result.
display('multipoint.intersection(...) =', multipoint_intersection)

# Display relevant geometries on the map.
m = geemap.Map()
m.set_center(-122.085, 37.422, 15)
m.add_layer(multipoint, {'color': 'black'}, 'Geometry [black]: multipoint')
m.add_layer(input_geom, {'color': 'blue'}, 'Parameter [blue]: input_geom')
m.add_layer(
    multipoint_intersection,
    {'color': 'red'},
    'Result [red]: multipoint.intersection',
)
m
# [END earthengine__apidocs__ee_geometry_multipoint_intersection]
