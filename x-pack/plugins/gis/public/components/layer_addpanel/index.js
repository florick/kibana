/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { connect } from 'react-redux';
import { FlyOut } from './view';
import { getFlyoutDisplay, updateFlyout, FLYOUT_STATE } from '../../store/ui';
import { getLayerLoading, getTemporaryLayers }
  from "../../selectors/map_selectors";
import { addVectorLayerFromEMSFileSource, removeLayer, clearTemporaryLayers, promoteTemporaryLayers, addXYZTMSLayerFromSource }
  from "../../actions/map_actions";
import _ from 'lodash';

function mapStateToProps(state = {}) {

  let emsVectorOptions = (state.map.meta && state.map.meta.data_sources) ? state.map.meta.data_sources.ems.file : [];
  emsVectorOptions = emsVectorOptions ? emsVectorOptions.map((file) => ({ value: file.name, text: file.name })) : [];

  return {
    flyoutVisible: getFlyoutDisplay(state) !== FLYOUT_STATE.NONE,
    emsVectorOptions: emsVectorOptions,
    layerLoading: getLayerLoading(state),
    temporaryLayers: !_.isEmpty(getTemporaryLayers(state))
  };
}

function mapDispatchToProps(dispatch) {
  return {
    closeFlyout: () => dispatch(updateFlyout(FLYOUT_STATE.NONE)) && dispatch(clearTemporaryLayers()),
    previewEMSFileLayer: (emsFileSource) => {
      dispatch(addVectorLayerFromEMSFileSource(emsFileSource, { temporary: true }));
    },
    previewXYZLayer: (xyzTmsLayerSource) => {
      dispatch(addXYZTMSLayerFromSource(xyzTmsLayerSource, { temporary: true }));
    },
    removeAction: layerName => dispatch(removeLayer(layerName)),
    addAction: () => dispatch(promoteTemporaryLayers())
  };
}

const connectedFlyOut = connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(FlyOut);
export { connectedFlyOut as FlyOut };