const sessionData = {
           "date": this.state.formData.calendarDate,
           "name": this.state.formData.import_name,
           "sample": {
               "name": this.state.formData.sample_text,
               "location": {
                 "type": "Point",
                 "coordinates": [
                   lon_data,
                   lat_data
              ]
            }
           },
           "analysis": [{
               // Can't seem to get or create this instance from the database
               "analysis_type": this.state.formData.analysis_name,
               "session_index": this.state.formData.session_index,
               "datum": [{
                   "value": _9Be_data,
                   "error": null,
                   "type": {
                       'parameter': '9Be carrier',
                       'unit': ''
                   }
               },{
                   "value": _10Be_data,
                   "error": null,
                   "type": {
                       'parameter': '10Be',
                       'unit': 'atoms/g'
                   }
               },{
                   "value": ratio_Be_data,
                   "error": null,
                   "type": {
                       'parameter': '10Be/9Be',
                       'unit': 'none'
                   }
               },{
                   "value": age_data,
                   "error": uncertainty_data,
                   "type": {
                       'parameter': '10Be Age',
                       'unit': 'ka'
                   }
               },{
                   "value": shielding_data,
                   "error": null,
                   "type": {
                       'parameter': 'Sheilding',
                       'unit': 'none'
                   }
               },{
                   "value": quartz_data,
                   "error": null,
                   "type": {
                       'parameter': 'Quartz',
                       'unit': 'none'
                   }
               },{
                   "value": elevation_data,
                   "error": null,
                   "type": {
                       'parameter': 'Elevation',
                       'unit': 'm'
                   }
               },{
                   "value": sigma_data,
                   "error": null,
                   "type": {
                       'parameter': '1 Sigma',
                       'unit': 'none'
                   }
               }]
           }]
      };
