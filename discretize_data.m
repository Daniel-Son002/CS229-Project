function [datagrp] = discretize_data(fulldata,nbins,parameter)
    data = fulldata(:,:);
    [y,~] = discretize(data.(parameter),nbins);
    data.discrete_var = y;
    
    datagrp = grpstats(data,"discrete_var","mean");
end

