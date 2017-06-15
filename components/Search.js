import React from 'react'
import Autosuggest from 'react-autosuggest';

const Search = (props) => {

    // Finally, render it!
    return (
      <Autosuggest
        suggestions={props.suggestions}
        onSuggestionsFetchRequested={props.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={props.onSuggestionsClearRequested}
        getSuggestionValue={props.getSuggestionValue}
        renderSuggestion={props.renderSuggestion}
        inputProps={props.inputProps}

      />

    );

}

module.exports = Search
