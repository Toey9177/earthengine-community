/**
 * Copyright 2021 The Google Earth Engine Community Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// [START earthengine__apidocs__ee_featurecollection_errormatrix]
/**
 * Classifies features in a FeatureCollection and computes an error matrix.
 */

// Combine Landsat and NLCD images using only the bands representing
// predictor variables (spectral reflectance) and target labels (land cover).
var landcover =
    ee.Image('USGS/NLCD_RELEASES/2016_REL/2016').select('landcover');
var spectral =
    ee.Image('LANDSAT/LC08/C02/T1_L2/LC08_038032_20160820').select('SR_B[1-7]');
var sampleSource = spectral.addBands(landcover);

// Sample the combined images to generate a FeatureCollection where each
// feature is a point with properties that define a given pixel's spectral
// response and the corresponding NLCD land cover classification.
var sample = sampleSource
                 .sample({
                   region: spectral.geometry(),
                   scale: 30,
                   numPixels: 2000,
                   geometries: true
                 })
                 // Add a random value column with uniform distribution for
                 // hold-out training/validation splitting.
                 .randomColumn({distribution: 'uniform'});
print('Sample for classifier development', sample);  // ee.FeatureCollection

// Split out ~80% of the sample for training the classifier.
var training = sample.filter('random < 0.8');
print('Training set', training);  // ee.FeatureCollection

// Train a random forest classifier.
var classifier = ee.Classifier.smileRandomForest(10).train({
  features: training,
  classProperty: landcover.bandNames().get(0),
  inputProperties: spectral.bandNames()
});

// Classify the sample.
var predictions = sample.classify(
    {classifier: classifier, outputName: 'predicted_landcover'});
print('Predictions', predictions);  // ee.FeatureCollection

// Split out the validation feature set.
var validation = predictions.filter('random >= 0.8');
print('Validation set', validation);  // ee.FeatureCollection

// Get a list of possible class values to use for error matrix axis labels.
var order = sample.aggregate_array('landcover').distinct().sort();
print('Error matrix axis labels', order);  // ee.List

// Compute an error matrix that compares predicted vs. expected values.
var errorMatrix = validation.errorMatrix({
  actual: landcover.bandNames().get(0),
  predicted: 'predicted_landcover',
  order: order
});
print('Error matrix', errorMatrix);  // ee.ConfusionMatrix

// Compute accuracy metrics from the error matrix.
print('Overall accuracy', errorMatrix.accuracy());  // 0.6073170731707317
print('Consumer\'s accuracy', errorMatrix.consumersAccuracy());  // ee.Array
print('Producer\'s accuracy', errorMatrix.producersAccuracy());  // ee.Array
print('Kappa', errorMatrix.kappa());  // 0.5010318006243716
// [END earthengine__apidocs__ee_featurecollection_errormatrix]
