def get_correlations(data):

    numeric_data = data.select_dtypes(include=['number'])

    correlation_matrix = numeric_data.corr()
    correlation_maxtrix_df = pd.DataFrame(correlation_matrix)

    # Flatten the dataframe
    correlation_data_flattened = correlation_matrix.stack().reset_index()
    correlation_data_flattened.columns = ['Feature 1', 'Feature 2', 'Correlation']

    # Remove the diagonals and duplicate feature combinations
    correlation_data_flattened = correlation_data_flattened[correlation_data_flattened['Feature 1'] != correlation_data_flattened['Feature 2']]
    correlation_data_flattened['features'] = correlation_data_flattened.apply(
        lambda row: tuple(sorted([row['Feature 1'], row['Feature 2']])), axis=1
    )
    correlation_data_flattened = correlation_data_flattened.drop_duplicates(subset='features')

    # Sort by correlation value
    correlation_data_flattened.sort_values(by='Correlation', ascending=False, inplace=True)
    correlation_data_flattened["Features"] = correlation_data_flattened["Feature 1"] + " & " + correlation_data_flattened["Feature 2"]

    # Drop the 'features' column as it was only needed for deduplication
    correlation_data_flattened = correlation_data_flattened.drop(columns='features')
    correlation_data_flattened.reset_index(drop=True, inplace=True)

    analysis_summary = {
        "correlation_maxtrix": correlation_maxtrix_df,
        "correlation_data_flattened": correlation_data_flattened
    }

    return correlation_data_flattened